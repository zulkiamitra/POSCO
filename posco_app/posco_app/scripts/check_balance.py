from pathlib import Path
p = Path('lib/features/orang_tua/edit_profile_screen.dart').read_text()
for ch in '(){}[]':
    print(ch, p.count(ch))

# show last 50 lines for inspection
lines = p.splitlines()
for i in range(max(0,len(lines)-50), len(lines)):
    print(f"{i+1:04}: {lines[i]}")
