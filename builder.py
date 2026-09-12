import io
import re
import glob

html_files = glob.glob('frontend/*.html')

for filename in html_files:
    with io.open(filename, 'r', encoding='utf-8', errors='ignore') as f:
        html = f.read()
    
    html = re.sub(r'assets/css/common\.css(\?v=\d+)?', 'assets/css/common.css?v=5', html)
    html = re.sub(r'assets/js/common\.js(\?v=\d+)?', 'assets/js/common.js?v=5', html)
    
    with io.open(filename, 'w', encoding='utf-8') as f:
        f.write(html)
