class MutableString:
    def __init__(self, init_str=""):
        self._data = list(init_str)
    
    def __getitem__(self, key):
        if isinstance(key, int):
            return self._data[key]
        elif isinstance(key, slice):
            return ''.join(self._data[key])
        else:
            raise TypeError("Indices must be integers or slices")
    
    def __setitem__(self, key, value):
        if isinstance(key, int):
            if not isinstance(value, str) or len(value) != 1:
                raise ValueError("Single character assignment must be a string of length 1")
            self._data[key] = value
        elif isinstance(key, slice):
            start, stop, step = key.indices(len(self._data))
            if step != 1:
                raise ValueError("Only step=1 is supported for slice assignment")
            
            value_list = list(value)
            
            self._data[start:stop] = value_list
        else:
            raise TypeError("Indices must be integers or slices")
    
    def __str__(self):
        return ''.join(self._data)
    
    def __repr__(self):
        return f"MutableString('{str(self)}')"
    
    def __len__(self):
        return len(self._data)
    
    def to_string(self):
        return str(self)
    
    def append(self, other):
        if isinstance(other, MutableString):
            self._data.extend(other._data)
        else:
            self._data.extend(list(str(other)))
        return self
    
    def __add__(self, other):
        result = MutableString(str(self))
        return result.append(other)
    
    def __iadd__(self, other):
        return self.append(other)