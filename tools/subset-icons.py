#!/usr/bin/env python3
"""
Gera um subconjunto (subset) da fonte de ícones bootstrap-icons contendo
apenas os ícones realmente usados pelo site. Reduz o download do woff2
(~130 KB) para poucos KB, sem alterar o restante do CSS.

Uso:
    python3 tools/subset-icons.py            # aplica a otimização
    python3 tools/subset-icons.py --dry-run  # apenas mede, não grava

Requer: fontTools (pip install fonttools brotli)
"""
import os
import re
import sys
import subprocess

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
CSS = os.path.join(ROOT, 'static/css/icons/bootstrap-icons.min.css')
FONT_DIR = os.path.join(ROOT, 'static/css/icons/fonts')
WOFF2 = os.path.join(FONT_DIR, 'bootstrap-icons.woff2')
WOFF = os.path.join(FONT_DIR, 'bootstrap-icons.woff')
SCAN_EXT = ('.html', '.js', '.css')


def load_codepoints(css_text):
    """Mapa nome-do-icone -> codepoint, lido do proprio CSS do bootstrap-icons."""
    mapping = {}
    # Seletores agrupados: .bi-a::before,.bi-b::before{content:"\f123"}
    for sel, code in re.findall(
            r'((?:\.bi-[a-z0-9-]+(?:::before)?,?)+)\{content:"\\([0-9a-fA-F]+)"\}', css_text):
        cp = int(code, 16)
        for name in re.findall(r'\.bi-([a-z0-9-]+)', sel):
            mapping[name] = cp
    return mapping


def used_icons(css_text):
    """Nomes de icones citados em qualquer html/js/css (fora o proprio css de icones)."""
    names = set()
    for dirpath, dirnames, filenames in os.walk(ROOT):
        if '.git' in dirpath.split(os.sep):
            continue
        for fn in filenames:
            if not fn.endswith(SCAN_EXT):
                continue
            path = os.path.join(dirpath, fn)
            if os.path.abspath(path) == os.path.abspath(CSS):
                continue
            try:
                text = open(path, encoding='utf-8', errors='ignore').read()
            except OSError:
                continue
            names.update(re.findall(r'\bbi-([a-z0-9-]+)', text))
    return names


def main(dry_run):
    css_text = open(CSS, encoding='utf-8').read()
    mapping = load_codepoints(css_text)
    used = used_icons(css_text)
    cps = sorted({mapping[n] for n in used if n in mapping})

    print('icones mapeados no CSS : %d' % len(mapping))
    print('icones citados no site : %d' % len(used))
    print('icones reconhecidos    : %d' % len(cps))
    missed = sorted(n for n in used if n not in mapping)
    if missed:
        print('citados sem glyph (ok se nao for icone): %s' % ', '.join(missed[:20]))

    if not cps:
        print('Nenhum codepoint encontrado — abortando.')
        return 1

    before2 = os.path.getsize(WOFF2)
    before = os.path.getsize(WOFF)
    print('tamanho atual: woff2=%s woff=%s' % (before2, before))

    if dry_run:
        out2 = '/tmp/opencode/subset-dryrun.woff2'
        subprocess.run(['pyftsubset', WOFF2,
                        '--unicodes=' + ','.join('U+%04X' % c for c in cps),
                        '--layout-features=*',
                        '--flavor=woff2', '--output-file=' + out2], check=True)
        print('dry-run woff2=%s  (economia %.0f%%)' %
              (os.path.getsize(out2),
               100 * (1 - os.path.getsize(out2) / before2)))
        return 0

    subprocess.run(['pyftsubset', WOFF2,
                    '--unicodes=' + ','.join('U+%04X' % c for c in cps),
                    '--layout-features=*',
                    '--flavor=woff2', '--output-file=' + WOFF2], check=True)
    subprocess.run(['pyftsubset', WOFF,
                    '--unicodes=' + ','.join('U+%04X' % c for c in cps),
                    '--layout-features=*',
                    '--flavor=woff', '--output-file=' + WOFF], check=True)
    after2 = os.path.getsize(WOFF2)
    after = os.path.getsize(WOFF)
    print('novo tamanho : woff2=%s woff=%s' % (after2, after))
    print('economia     : %.0f%%' % (100 * (1 - after2 / before2)))
    return 0


if __name__ == '__main__':
    sys.exit(main('--dry-run' in sys.argv))
