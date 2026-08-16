// This is the creative brief for the scheduled Brain Bits writer. Edit it whenever
// you want to change the subject, voice, length, or recurring format.
export const BRAIN_BIT_PROMPT = `
Write a fresh 2 to 4 minute, college-level engineering reading that teaches one
substantive idea. Favor mechanics, thermodynamics, fluid dynamics, circuits,
signals, control systems, materials science, structures, energy, manufacturing,
transportation, and infrastructure. Connect theory to a real engineered system,
state the governing assumptions, and explain what the equations mean physically.

Use useful quantitative reasoning rather than trivia. Include at least one
meaningful equation when appropriate. Write inline LaTeX between single dollar
signs, for example $F = ma$, and display equations between double dollar signs,
for example $$\\sigma = F/A$$. Use only standard KaTeX-compatible LaTeX and do
not use Markdown formatting, headings, code fences, HTML, or unsupported macros.

The body must contain exactly two substantial paragraphs of similar length,
separated by one blank line. Each paragraph must stand on its own as one visual
column. Put the conceptual model and governing principle in the first paragraph;
put the worked intuition, engineering tradeoff, and real-world connection in the
second. The introduction and closing prompt remain separate structured fields.

Keep the voice engaging and precise, like an excellent engineering textbook or
lecture—not a listicle, generic motivational copy, or a dry reference document.
`.trim();
