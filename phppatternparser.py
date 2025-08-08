from typing import List
import re

class PHP_PatternParser:
    start = 0
    end = 0

    def __init__(self, start = 0, end = 0):
        self.start = start
        self.end = end
    
    def __str__(self):
        return f'PHP Pattern ({self.start}, {self.end})'

def safe_match_next (raw, i, mt):
    if i + len (mt) < len (raw):
        return all ([raw[x] == mt[x - i] for x in range (i, i + len (mt))])
    return False

class React_ComponentParser:
    start = 0
    end = 0
    comp_start = 0

    def __init__(self, start = 0, end = 0, comp_start = 0):
        self.start = start
        self.end = end
        self.comp_start = comp_start
    
    def __str__(self):
        return f'React Component Pattern ({self.start}, {self.end}, {self.comp_start})'

def php_pattern_parse (raw: str) -> List[PHP_PatternParser]:
    res: List[PHP_PatternParser] = []
    i = 0
    in_str = False
    str_token = None
    saw_php_open = False

    while i < len (raw):
        iv = raw[i]

        if iv in ['\'', '"']:
            if not in_str:
                str_token = iv
                in_str = True
            else:
                if raw[i - 1] == '\\':
                    if i > 1:
                        if raw[i - 2] == '\\':
                            if str_token == iv:
                                in_str = False
                    else:
                        ... # do nothing
                else:
                    if str_token == iv:
                        in_str = False

        if not in_str:
            if safe_match_next (raw, i, '<?php'):
                saw_php_open = True
                res.append (PHP_PatternParser (i + len ('<?php')))
            elif safe_match_next (raw, i, '?>'):
                saw_php_open = False
                res[-1].end = i
        
        i += 1
    
    return res

def parse_component_clauses(raw: str) -> List[React_ComponentParser]:
    res = []
    arrow_matches = list(re.finditer(r'\(.*?\)\s*=>\s*\{', raw))

    func_matches = list(re.finditer(r'\bfunction\b\s+\w+\s*\(.*?\)\s*\{', raw))
    
    all_matches = arrow_matches + func_matches
    all_matches.sort(key=lambda m: m.start())
    
    for match in all_matches:
        start_pos = match.start()
        open_brace_pos = match.end() - 1
    
        depth = 1
        i = open_brace_pos + 1
        
        while i < len(raw) and depth > 0:
            if raw[i] == '{':
                depth += 1
            elif raw[i] == '}':
                depth -= 1
                if depth == 0:
                    res.append(React_ComponentParser(start_pos, i + 1, open_brace_pos + 1))
            i += 1
    
    return res