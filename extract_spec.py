import pypdf

reader = pypdf.PdfReader('/Users/ionutcatalindanescu/Desktop/techschedule-vibe-coding-spec.pdf')
print(f"Total pages: {len(reader.pages)}")

with open('techschedule-spec-text.txt', 'w', encoding='utf-8') as f:
    for i, page in enumerate(reader.pages):
        f.write(f"--- PAGE {i+1} ---\n")
        f.write(page.extract_text() + "\n")

print("Done extracting spec text.")
