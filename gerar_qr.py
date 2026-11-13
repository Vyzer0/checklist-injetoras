import qrcode
BASE = "https://vyzer0.github.io/checklist-injetoras/"
for n in range(1, 22):
    qrcode.make(f"{BASE}?inj={n}").save(f"injetora{n:02d}.png")