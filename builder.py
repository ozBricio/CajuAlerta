import io
import re

with io.open('frontend/assets/js/cadastro.js', 'r', encoding='utf-8', errors='ignore') as f:
    cjs = f.read()

cjs = cjs.replace('  });\\n  });\\n}', '  });\\n}')

with io.open('frontend/assets/js/cadastro.js', 'w', encoding='utf-8') as f:
    f.write(cjs)
