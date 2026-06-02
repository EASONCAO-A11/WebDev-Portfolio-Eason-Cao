#!/usr/bin/env python3
"""Fetch all 6 coursework HTML files and print their contents for embedding."""
import os, html

BASE = '/tmp/WebDev-Coursework-Eason-Cao'
files = [
    ('Unit-10/Lesson-1/Code Challenge/Index.html', 'unit10-l1'),
    ('Unit-9/Lesson-3/Code challenge.html', 'unit9-l3'),
    ('Unit-4/lesson-2/Code Challenge Lists.html', 'unit4-l2'),
    ('Unit-4/lesson-3/Code Challenge Embedding Images.html', 'unit4-l3'),
    ('Unit-5/Lesson-3/Internal Style to the website.html', 'unit5-l3'),
    ('Unit-10/Lesson-2/Code Challenge/index.html', 'unit10-l2'),
]

for rel_path, file_id in files:
    full_path = os.path.join(BASE, rel_path)
    if os.path.exists(full_path):
        with open(full_path, 'r', encoding='utf-8', errors='replace') as f:
            content = f.read()
        escaped = html.escape(content)
        print(f'<!-- FILE:{file_id} -->')
        print(f'<pre class="code-block" id="code-{file_id}" hidden><code>{escaped}</code></pre>')
    else:
        print(f'<!-- FILE:{file_id} NOT FOUND: {full_path} -->')
