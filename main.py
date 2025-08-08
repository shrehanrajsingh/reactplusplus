import sys
import os
import math
import re

from phppatternparser import PHP_PatternParser, php_pattern_parse, parse_component_clauses
import threading
import subprocess
import signal

if len(sys.argv) < 2:
    print("Usage: python3 main.py <file_name>")

fname = sys.argv[1]

TEMPLATE = """function Snippet_{n}() {{
    {code}
}}

AddSnippet ('/snippet/{n}', 'Snippet_{n}');
"""

USE_STATE_TEMPLATE = """
const [{vname}, set{vname}] = useState("");

  useEffect(() => {{
    fetch("/api/snippet/{snip}", {{
      method: "GET"
    }})
      .then((res) => res.text())
      .then(set{vname});
  }}, []);
"""

assert fname.endswith(".php"), f"File {fname} is not a PHP file"
assert os.path.isfile(fname), f"File {fname} does not exist"

rpphost_dir = "./rpphost"
node_modules_path = os.path.join(rpphost_dir, "node_modules")

if not os.path.exists(node_modules_path):
    print("node_modules directory not found. Running npm install...")
    try:
        with open("npm_install.log", "w") as npm_log:
            subprocess.run(
                ["npm", "install"], cwd=rpphost_dir,
                stdout=npm_log, stderr=npm_log, check=True
            )
        print("npm install completed successfully.")
    except subprocess.CalledProcessError as e:
        print(f"Error during npm install: {e}")
else:
    print("node_modules directory already exists. Skipping npm install.")

template_php = ''

with open('template_server.php', 'r') as f:
    template_php = f.read()

with open(fname, 'r') as f:
    data = f.read()
    clauses = php_pattern_parse(data)
    code_sn = []

    for i, iv in enumerate(clauses):
        if not i:
            code_sn.append(data[iv.start:iv.end].strip())
            continue

        t = TEMPLATE.format(
            n=i,
            code=data[iv.start:iv.end]
        )

        code_sn.append(t)

        server_code_final = template_php.replace(
            '// CODE_SNIPPET_AUTOMATED', '\n\n'.join(code_sn)
        )

        with open('out/server.php', 'w') as g:
            g.write(server_code_final)

    var_c = 0
    var_n = '__rpp_var_{n}'

    result = 'import { useEffect, useState } from "react";\n'
    last_end = 0

    comps = parse_component_clauses(data)

    # for i in comps:
    #     print(i)

    # for i in clauses:
    #     print(i)

    # a map
    # react component => php code occurance
    var_comp_map = dict()

    # another map
    php_code_in_components = dict()

    for i, iv in enumerate(clauses):
        in_component = False
        which_comp = None

        for j, jv in enumerate(comps):
            # print(iv.start, jv.start, jv.end, iv.end)
            if jv.start <= iv.start <= iv.end <= jv.end:
                in_component = True
                which_comp = jv
                break

        if in_component:
            if which_comp not in var_comp_map:
                var_comp_map[which_comp] = []

            var_comp_map[which_comp].append(iv)
            php_code_in_components[iv] = 1

    # for i, j in var_comp_map.items():
    #     print(i, *j)

    comp_var_map = {}
    for i, (comp, php_clauses) in enumerate(var_comp_map.items()):
        vname = f"Var{i+1}"
        comp_var_map[comp] = vname

    result = 'import { useEffect, useState } from "react";\n'
    last_pos = 0

    for i in range(len(data)):
        if i < last_pos:
            continue

        current_clause = None
        for clause in clauses:
            if clause.start == i:
                current_clause = clause
                break

        if current_clause:
            result += data[last_pos:current_clause.start]

            in_component = False
            current_comp = None
            for comp, php_clauses in var_comp_map.items():
                if current_clause in php_clauses:
                    in_component = True
                    current_comp = comp
                    break

            if in_component:
                vname = comp_var_map[current_comp]
                result = result[:-5]
                result += '{' + vname + '}'
            else:
                result = result[:-5]

            last_pos = current_clause.end + 2
        else:
            current_comp = None
            for comp in comp_var_map.keys():
                if comp.start == i:
                    current_comp = comp
                    break

            if current_comp:
                # Find opening brace position
                comp_text = data[current_comp.start:current_comp.end]
                brace_pos = comp_text.find('{')
                if brace_pos != -1:
                    brace_pos += current_comp.start

                    result += data[last_pos:brace_pos+1]

                    vname = comp_var_map[current_comp]
                    snip_index = clauses.index(var_comp_map[current_comp][0])
                    hook_code = USE_STATE_TEMPLATE.format(
                        vname=vname, snip=snip_index)
                    result += hook_code

                    last_pos = brace_pos + 1
                else:
                    result += data[last_pos:i+1]
                    last_pos = i + 1
            else:
                result += data[i:i+1]
                last_pos = i + 1

    if last_pos < len(data):
        result += data[last_pos:]

    with open('rpphost/src/__app_gen.jsx', 'w') as f:
        f.write(result)

react_process = None
php_process = None


def run_react_server():
    global react_process
    try:
        with open("react_server.log", "w") as react_log:
            react_process = subprocess.Popen(
                ["npm", "run", "dev"], cwd="./rpphost",
                stdout=react_log, stderr=react_log)
            react_process.wait()
    except Exception as e:
        print(f"Error running React server: {e}")


def run_php_server():
    global php_process
    try:
        with open("php_server.log", "w") as php_log:
            php_process = subprocess.Popen(
                ["php", "-S", "localhost:4000", "out/server.php"],
                stdout=php_log, stderr=php_log)
            php_process.wait()
    except Exception as e:
        print(f"Error running PHP server: {e}")


def signal_handler(sig, frame):
    print("\nShutting down servers...")
    if react_process:
        react_process.terminate()
    if php_process:
        php_process.terminate()
    sys.exit(0)


signal.signal(signal.SIGINT, signal_handler)

react_thread = threading.Thread(target=run_react_server)
php_thread = threading.Thread(target=run_php_server)

print("Starting servers...")
react_thread.start()
php_thread.start()

print("Vite server is hosted in localhost:5173 and PHP server is hosted in localhost:4000")
print("Press Ctrl+C to stop.")

react_thread.join()
php_thread.join()

print("Servers have been stopped.")
