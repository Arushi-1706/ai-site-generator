
import { useState } from "react";

const demoSite = {
  siteName: "Arushi | Cybersecurity",
  description: "Building a safer digital world.",
  theme: {
    style: "Dark cyberpunk",
    primaryColor: "#a78bfa",
    backgroundColor: "#080b16",
    textColor: "#f1f5f9",
  },
  hero: {
    title: "Securing the Digital Frontier.",
    subtitle:
      "Cybersecurity student, curious problem-solver, and builder of things that make the digital world safer.",
    buttonText: "Explore My Work",
  },
  sections: [
    {
      type: "about",
      title: "Curiosity Meets Security",
      description:
        "Exploring computer science, cybersecurity, and the ideas that help make technology safer.",
      items: [
        {
          title: "Think Differently",
          description:
            "Question assumptions. Understand systems. Find better solutions.",
        },
        {
          title: "Keep Learning",
          description:
            "Build skills one experiment and project at a time.",
        },
      ],
    },
    {
      type: "skills",
      title: "My Tech Stack",
      description: "The technologies I'm learning and exploring.",
      items: [
        { title: "C++", description: "Programming fundamentals" },
        { title: "Java", description: "Object-oriented programming" },
        { title: "Python", description: "Scripting and automation" },
        {
          title: "Web Development",
          description: "HTML, CSS and JavaScript",
        },
        {
          title: "Networking",
          description: "Core networking concepts",
        },
        {
          title: "Cybersecurity",
          description: "Security fundamentals",
        },
      ],
    },
    {
      type: "projects",
      title: "Selected Projects",
      description:
        "Ideas brought to life through code and experimentation.",
      items: [
        {
          title: "AI Site Generator",
          description:
            "An AI-powered website builder that transforms natural-language prompts into editable website previews.",
          url: "https://ai-site-generator-chi.vercel.app/",
        },
        {
          title: "Weather Vibe Check",
          description:
            "A weather application built with HTML, CSS, and JavaScript to explore current weather conditions.",
          url: "https://arushi-1706.github.io/weather-vibe-check/",
        },
      ],
    },
    {
      type: "contact",
      title: "Get in Touch",
      description:
        "Have an interesting idea or a project in mind? Let's talk about technology and what we can build.",
      email: "",
      items: [],
    },
  ],
};

function normalizeSite(raw) {
  if (typeof raw === "string") {
    const cleaned = raw
      .replace(/^```(?:json)?\s*/i, "")
      .replace(/\s*```$/, "")
      .trim();

    raw = JSON.parse(cleaned);
  }

  if (!raw || typeof raw !== "object" || !raw.hero) {
    throw new Error("The AI returned an invalid website description.");
  }

  return {
    ...raw,
    theme: { ...demoSite.theme, ...raw.theme },
    hero: { ...demoSite.hero, ...raw.hero },
    sections: Array.isArray(raw.sections)
      ? raw.sections.map((section) => ({
          ...section,
          items: Array.isArray(section.items) ? section.items : [],
          email: section.email || "",
        }))
      : [],
  };
}

export default function Home() {
  const [prompt, setPrompt] = useState("");
  const [site, setSite] = useState(demoSite);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [mode, setMode] = useState("preview");

  async function handleGenerate() {
    if (!prompt.trim()) {
      setError("Describe the website you want to create first.");
      return;
    }

    setLoading(true);
    setError("");

    try {
      const response = await fetch("/api/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ prompt }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Website generation failed.");
      }

      const generatedSite = normalizeSite(data.result);
      setSite(generatedSite);
      setMode("preview");
    } catch (err) {
      setError(
        err.message ||
          "Couldn't generate the website. Your current preview is still available."
      );
    } finally {
      setLoading(false);
    }
  }

  function updateHero(field, value) {
    setSite((prev) => ({
      ...prev,
      hero: {
        ...prev.hero,
        [field]: value,
      },
    }));
  }

  function updateSection(sectionIndex, field, value) {
    setSite((prev) => ({
      ...prev,
      sections: prev.sections.map((section, index) =>
        index === sectionIndex
          ? { ...section, [field]: value }
          : section
      ),
    }));
  }

  function updateItem(sectionIndex, itemIndex, field, value) {
    setSite((prev) => ({
      ...prev,
      sections: prev.sections.map((section, index) =>
        index === sectionIndex
          ? {
              ...section,
              items: section.items.map((item, j) =>
                j === itemIndex
                  ? { ...item, [field]: value }
                  : item
              ),
            }
          : section
      ),
    }));
  }

  function addSection() {
    setSite((prev) => ({
      ...prev,
      sections: [
        ...prev.sections,
        {
          type: "custom",
          title: "New Section",
          description: "Add your content here.",
          items: [],
        },
      ],
    }));
  }

  function removeSection(sectionIndex) {
    setSite((prev) => ({
      ...prev,
      sections: prev.sections.filter(
        (_, index) => index !== sectionIndex
      ),
    }));
  }

  function addItem(sectionIndex) {
    setSite((prev) => ({
      ...prev,
      sections: prev.sections.map((section, index) =>
        index === sectionIndex
          ? {
              ...section,
              items: [
                ...section.items,
                {
                  title: "New item",
                  description: "Describe this item.",
                },
              ],
            }
          : section
      ),
    }));
  }

  function removeItem(sectionIndex, itemIndex) {
    setSite((prev) => ({
      ...prev,
      sections: prev.sections.map((section, index) =>
        index === sectionIndex
          ? {
              ...section,
              items: section.items.filter(
                (_, j) => j !== itemIndex
              ),
            }
          : section
      ),
    }));
  }

  const theme = site.theme || demoSite.theme;

  return (
    <main style={styles.app}>
      <header style={styles.topbar}>
        <div style={styles.brand}>
          <span style={styles.brandIcon}>✳</span>
          <span>
            sitecraft<span style={{ color: "#a78bfa" }}>.</span>
          </span>
        </div>

        <span style={styles.topLabel}>AI WEBSITE STUDIO</span>

        <button
          style={styles.newButton}
          onClick={() => {
            setPrompt("");
            setSite(demoSite);
            setError("");
            setMode("preview");
          }}
        >
          + New project
        </button>
      </header>

      <div style={styles.workspace}>
        <aside style={styles.sidebar}>
          <div style={styles.sideHeading}>CREATE YOUR WEBSITE</div>

          <h1 style={styles.panelTitle}>
            Imagine it.
            <br />
            Build it.
          </h1>

          <p style={styles.muted}>
            Describe your idea and let AI turn it into a website.
          </p>

          <label style={styles.label}>YOUR PROMPT</label>

          <textarea
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            placeholder="A sleek portfolio for a cybersecurity student, with a dark theme, glowing purple accents, project cards..."
            rows={7}
            style={styles.textarea}
          />

          <button
            onClick={handleGenerate}
            disabled={loading}
            style={{
              ...styles.generateButton,
              opacity: loading ? 0.65 : 1,
            }}
          >
            {loading
              ? "✳ Creating your website..."
              : "✳ Generate website"}
          </button>

          <p style={styles.hint}>
            Tip: Describe the purpose, visual style, colors, and sections
            you want.
          </p>

          {error && <div style={styles.error}>{error}</div>}

          <div style={styles.statusCard}>
            <span style={styles.statusDot} />
            <div>
              <div style={{ fontWeight: 600, fontSize: 12 }}>
                Preview available
              </div>
              <div style={styles.mutedSmall}>
                {loading
                  ? "Waiting for AI..."
                  : "Your workspace is ready"}
              </div>
            </div>
          </div>
        </aside>

        <section style={styles.editor}>
          <div style={styles.editorBar}>
            <div style={styles.windowDots}>
              <i />
              <i />
              <i />
            </div>

            <div style={styles.addressBar}>
              <span>⌑</span> your-website.site
            </div>

            <div style={styles.viewToggle}>
              <button
                onClick={() => setMode("preview")}
                style={
                  mode === "preview"
                    ? styles.activeToggle
                    : styles.toggle
                }
              >
                Preview
              </button>

              <button
                onClick={() => setMode("content")}
                style={
                  mode === "content"
                    ? styles.activeToggle
                    : styles.toggle
                }
              >
                Content
              </button>
            </div>
          </div>

          {mode === "preview" ? (
            <WebsitePreview site={site} theme={theme} />
          ) : (
            <div style={styles.contentView}>
              <h2 style={styles.contentHeading}>Website editor</h2>

              <p style={styles.muted}>
                Edit your content below. Switch to Preview to see your
                changes.
              </p>

              <label style={styles.label}>WEBSITE NAME</label>
              <input
                value={site.siteName || ""}
                onChange={(e) =>
                  setSite((prev) => ({
                    ...prev,
                    siteName: e.target.value,
                  }))
                }
                style={styles.editInput}
                placeholder="Your website name"
              />

              <label style={styles.label}>WEBSITE DESCRIPTION</label>
              <textarea
                value={site.description || ""}
                onChange={(e) =>
                  setSite((prev) => ({
                    ...prev,
                    description: e.target.value,
                  }))
                }
                style={styles.editTextarea}
                rows={2}
                placeholder="A short description of your website"
              />

              <div style={styles.divider} />

              <h3 style={styles.editorSectionHeading}>Hero section</h3>

              <label style={styles.label}>HERO HEADLINE</label>
              <input
                value={site.hero.title || ""}
                onChange={(e) => updateHero("title", e.target.value)}
                style={styles.editInput}
                placeholder="Your website headline"
              />

              <label style={styles.label}>HERO SUBTITLE</label>
              <textarea
                value={site.hero.subtitle || ""}
                onChange={(e) =>
                  updateHero("subtitle", e.target.value)
                }
                style={styles.editTextarea}
                rows={4}
                placeholder="Describe yourself or your website"
              />

              <label style={styles.label}>HERO BUTTON TEXT</label>
              <input
                value={site.hero.buttonText || ""}
                onChange={(e) =>
                  updateHero("buttonText", e.target.value)
                }
                style={styles.editInput}
                placeholder="Explore My Work"
              />

              <div style={styles.divider} />

              <div style={styles.sectionHeaderRow}>
                <h3 style={styles.editorSectionHeading}>
                  Website sections
                </h3>

                <button
                  style={styles.smallButton}
                  onClick={addSection}
                >
                  + Add section
                </button>
              </div>

              {site.sections.map((section, i) => (
                <div
                  key={`${section.type}-${i}`}
                  style={styles.contentCard}
                >
                  <div style={styles.sectionHeaderRow}>
                    <span style={styles.sectionNumber}>
                      SECTION {i + 1}
                    </span>

                    <button
                      style={styles.removeButton}
                      onClick={() => removeSection(i)}
                    >
                      Remove
                    </button>
                  </div>

                  <label style={styles.label}>SECTION TYPE</label>
                  <select
                    value={section.type || "custom"}
                    onChange={(e) =>
                      updateSection(i, "type", e.target.value)
                    }
                    style={styles.editInput}
                  >
                    <option value="about">About</option>
                    <option value="skills">Skills</option>
                    <option value="features">Features</option>
                    <option value="projects">Projects</option>
                    <option value="contact">Contact</option>
                    <option value="custom">Custom</option>
                  </select>

                  <label style={styles.label}>SECTION TITLE</label>
                  <input
                    value={section.title || ""}
                    onChange={(e) =>
                      updateSection(i, "title", e.target.value)
                    }
                    style={styles.editInput}
                    placeholder="Section title"
                  />

                  <label style={styles.label}>SECTION DESCRIPTION</label>
                  <textarea
                    value={section.description || ""}
                    onChange={(e) =>
                      updateSection(i, "description", e.target.value)
                    }
                    style={styles.editTextarea}
                    rows={3}
                    placeholder="Section description"
                  />

                  {section.type === "contact" && (
                    <>
                      <label style={styles.label}>CONTACT EMAIL</label>
                      <input
                        type="email"
                        value={section.email || ""}
                        onChange={(e) =>
                          updateSection(i, "email", e.target.value)
                        }
                        style={styles.editInput}
                        placeholder="you@example.com"
                      />

                      <p style={styles.fieldHint}>
                        Leave blank if you don't want to display an
                        email address.
                      </p>
                    </>
                  )}

                  <div style={styles.itemsHeadingRow}>
                    <span style={styles.labelInline}>
                      SECTION ITEMS
                    </span>

                    <button
                      style={styles.smallButton}
                      onClick={() => addItem(i)}
                    >
                      + Add item
                    </button>
                  </div>

                  {section.items.map((item, j) => (
                    <div key={j} style={styles.itemEditor}>
                      <div style={styles.sectionHeaderRow}>
                        <span style={styles.fieldHint}>
                          Item {j + 1}
                        </span>

                        <button
                          style={styles.removeButton}
                          onClick={() => removeItem(i, j)}
                        >
                          Remove item
                        </button>
                      </div>

                      <label style={styles.label}>ITEM TITLE</label>
                      <input
                        value={item.title || ""}
                        onChange={(e) =>
                          updateItem(i, j, "title", e.target.value)
                        }
                        style={styles.editInput}
                        placeholder="Item title"
                      />

                      <label style={styles.label}>
                        ITEM DESCRIPTION
                      </label>
                      <textarea
                        value={item.description || ""}
                        onChange={(e) =>
                          updateItem(
                            i,
                            j,
                            "description",
                            e.target.value
                          )
                        }
                        style={styles.editTextarea}
                        rows={2}
                        placeholder="Item description"
                      />

                      {section.type === "projects" && (
                        <>
                          <label style={styles.label}>
                            PROJECT LINK (OPTIONAL)
                          </label>

                          <input
                            type="url"
                            value={item.url || ""}
                            onChange={(e) =>
                              updateItem(i, j, "url", e.target.value)
                            }
                            style={styles.editInput}
                            placeholder="https://example.com"
                          />

                          <p style={styles.fieldHint}>
                            Add a URL to show a View project link on
                            this project's preview card.
                          </p>
                        </>
                      )}
                    </div>
                  ))}
                </div>
              ))}
            </div>
          )}
        </section>
      </div>
    </main>
  );
}

function WebsitePreview({ site, theme }) {
  const bg = theme.backgroundColor || "#080b16";
  const accent = theme.primaryColor || "#a78bfa";
  const color = theme.textColor || "#f1f5f9";

  return (
    <div
      style={{
        ...styles.website,
        background: bg,
        color,
      }}
    >
      <nav style={styles.siteNav}>
        <a href="#home" style={{ ...styles.siteLogo, color }}>
          <span style={{ color: accent }}>✳</span>{" "}
          {site.siteName}
        </a>

        <div style={styles.navLinks}>
          {site.sections.map((section, index) => (
            <a
              key={`${section.type}-${index}`}
              href={`#${section.type === "features" ? "skills" : section.type}`}
            >
              {section.type === "about"
                ? "About"
                : section.type === "skills" ||
                    section.type === "features"
                  ? "Skills"
                  : section.type === "projects"
                    ? "Projects"
                    : section.type === "contact"
                      ? "Contact"
                      : section.title || "Section"}
            </a>
          ))}
        </div>
      </nav>

      <section id="home" style={styles.hero}>
        <div
          style={{
            ...styles.orb,
            background: accent,
          }}
        />

        <div style={styles.eyebrow}>
          <span style={{ color: accent }}>✳</span>{" "}
          BUILDING WHAT'S NEXT
        </div>

        <h1 style={styles.heroTitle}>{site.hero.title}</h1>

        <p style={styles.heroSubtitle}>{site.hero.subtitle}</p>

        {site.hero.buttonText && (
          <a
            href="#projects"
            style={{
              ...styles.heroButton,
              background: accent,
            }}
          >
            {site.hero.buttonText} <span>↗</span>
          </a>
        )}

        <div style={styles.scrollNote}>SCROLL TO EXPLORE ↓</div>
      </section>

      {site.sections.map((section, index) => {
        const id =
          section.type === "features" ? "skills" : section.type;

        return (
          <section
            key={`${section.type}-${index}`}
            id={id}
            style={styles.siteSection}
          >
            <div style={styles.sectionEyebrow}>
              {String(index + 1).padStart(2, "0")} /{" "}
              (section.type || "custom").toUpperCase()
            </div>

            <h2 style={styles.sectionTitle}>{section.title}</h2>

            {section.description && (
              <p style={styles.sectionDescription}>
                {section.description}
              </p>
            )}

            {section.type === "contact" && section.email && (
              <p style={styles.contactEmail}>
                Email:{" "}
                <a
                  href={`mailto:${section.email}`}
                  style={{ color: accent }}
                >
                  {section.email}
                </a>
              </p>
            )}

            {section.items?.length > 0 && (
              <div style={styles.itemGrid}>
                {section.items.map((item, i) => (
                  <article key={i} style={styles.itemCard}>
                    <div
                      style={{
                        ...styles.cardSymbol,
                        color: accent,
                      }}
                    >
                      {section.type === "skills"
                        ? "⌘"
                        : section.type === "projects"
                          ? "↗"
                          : "✳"}
                    </div>

                    <h3 style={styles.itemTitle}>{item.title}</h3>

                    <p style={styles.itemDescription}>
                      {item.description}
                    </p>

                    {section.type === "projects" && item.url && (
                      <a
                        href={item.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        style={{
                          ...styles.projectLink,
                          color: accent,
                        }}
                      >
                        View project ↗
                      </a>
                    )}
                  </article>
                ))}
              </div>
            )}
          </section>
        );
      })}

      <footer style={styles.siteFooter}>
        <span>
          <span style={{ color: accent }}>✳</span>{" "}
          {site.siteName}
        </span>

        <span>Designed with curiosity. Built for the future.</span>
      </footer>
    </div>
  );
}

const styles = {
  app: {
    minHeight: "100vh",
    background: "#0b0d14",
    color: "#f1f5f9",
    fontFamily: "Inter, ui-sans-serif, system-ui, sans-serif",
  },
  topbar: {
    height: 68,
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    padding: "0 25px",
    borderBottom: "1px solid #252735",
    background: "#10121b",
    gap: 16,
  },
  brand: {
    display: "flex",
    alignItems: "center",
    gap: 9,
    fontSize: 20,
    fontWeight: 800,
    letterSpacing: "-0.8px",
  },
  brandIcon: { color: "#b5a0ff", fontSize: 25 },
  topLabel: {
    color: "#7d8095",
    fontSize: 10,
    letterSpacing: 2,
    fontWeight: 700,
  },
  newButton: {
    border: "1px solid #343648",
    borderRadius: 8,
    background: "#1a1c28",
    color: "#e8e8f0",
    padding: "9px 12px",
    cursor: "pointer",
  },
  workspace: {
    display: "grid",
    gridTemplateColumns: "310px minmax(0, 1fr)",
    minHeight: "calc(100vh - 68px)",
  },
  sidebar: {
    padding: "30px 22px",
    borderRight: "1px solid #252735",
    background: "#10121b",
  },
  sideHeading: {
    fontSize: 10,
    fontWeight: 800,
    letterSpacing: 1.7,
    color: "#a78bfa",
  },
  panelTitle: {
    fontSize: 30,
    lineHeight: 1.15,
    letterSpacing: -1,
    margin: "20px 0 10px",
  },
  muted: {
    color: "#9295a8",
    fontSize: 13,
    lineHeight: 1.7,
  },
  label: {
    display: "block",
    fontSize: 10,
    fontWeight: 800,
    letterSpacing: 1.4,
    margin: "20px 0 10px",
    color: "#c1c2d0",
  },
  textarea: {
    width: "100%",
    boxSizing: "border-box",
    background: "#171925",
    color: "#f4f4fa",
    border: "1px solid #343648",
    borderRadius: 10,
    padding: 13,
    font: "13px/1.7 inherit",
    resize: "vertical",
    outlineColor: "#a78bfa",
  },
  generateButton: {
    width: "100%",
    marginTop: 13,
    padding: 13,
    border: 0,
    borderRadius: 9,
    background: "linear-gradient(110deg, #8b5cf6, #6d5ce8)",
    color: "white",
    fontSize: 13,
    fontWeight: 700,
    cursor: "pointer",
  },
  hint: {
    color: "#777b90",
    fontSize: 11,
    lineHeight: 1.7,
    marginTop: 12,
  },
  error: {
    marginTop: 15,
    padding: 12,
    background: "#351d2a",
    border: "1px solid #713047",
    borderRadius: 8,
    color: "#ffb4c2",
    fontSize: 12,
    lineHeight: 1.6,
  },
  statusCard: {
    display: "flex",
    alignItems: "center",
    gap: 10,
    marginTop: 35,
    borderTop: "1px solid #292b3b",
    paddingTop: 18,
  },
  statusDot: {
    width: 8,
    height: 8,
    borderRadius: "50%",
    background: "#55d6a1",
    boxShadow: "0 0 10px #55d6a155",
  },
  mutedSmall: {
    color: "#85889a",
    fontSize: 10,
    marginTop: 4,
  },
  editor: {
    minWidth: 0,
    padding: 18,
    background: "#0b0d14",
  },
  editorBar: {
    height: 47,
    display: "flex",
    alignItems: "center",
    gap: 14,
    padding: "0 12px",
    background: "#151722",
    border: "1px solid #292b3b",
    borderRadius: "10px 10px 0 0",
  },
  windowDots: {
    display: "flex",
    gap: 5,
  },
  addressBar: {
    flex: 1,
    maxWidth: 340,
    margin: "0 auto",
    background: "#0d0f17",
    color: "#8e91a5",
    border: "1px solid #292b3b",
    borderRadius: 6,
    textAlign: "center",
    padding: "6px 10px",
    fontSize: 11,
  },
  viewToggle: {
    display: "flex",
    gap: 4,
  },
  toggle: {
    color: "#9395a9",
    background: "transparent",
    border: 0,
    padding: "7px 9px",
    cursor: "pointer",
    fontSize: 11,
  },
  activeToggle: {
    color: "#fff",
    background: "#343046",
    border: "1px solid #51456f",
    borderRadius: 6,
    padding: "7px 9px",
    cursor: "pointer",
    fontSize: 11,
  },
  website: {
    minHeight: 700,
    overflow: "hidden",
    border: "1px solid #292b3b",
    borderTop: 0,
  },
  siteNav: {
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    gap: 15,
    padding: "22px 7%",
    borderBottom: "1px solid #ffffff12",
    flexWrap: "wrap",
  },
  siteLogo: {
    fontWeight: 800,
    fontSize: 13,
    textDecoration: "none",
    overflowWrap: "anywhere",
  },
  navLinks: {
    display: "flex",
    flexWrap: "wrap",
    gap: 18,
    fontSize: 11,
  },
  hero: {
    position: "relative",
    isolation: "isolate",
    minHeight: 430,
    padding: "100px 9% 65px",
    overflow: "hidden",
  },
  orb: {
    position: "absolute",
    zIndex: -1,
    width: 240,
    height: 240,
    borderRadius: "50%",
    filter: "blur(100px)",
    opacity: 0.23,
    top: 70,
    right: "5%",
  },
  eyebrow: {
    fontSize: 10,
    letterSpacing: 2.5,
    fontWeight: 800,
    color: "#b3b5c8",
  },
  heroTitle: {
    maxWidth: 720,
    fontSize: "clamp(38px, 5vw, 66px)",
    lineHeight: 1.06,
    letterSpacing: "-2.7px",
    margin: "24px 0",
    fontWeight: 800,
  },
  heroSubtitle: {
    maxWidth: 540,
    color: "#a4a7b9",
    fontSize: 14,
    lineHeight: 1.9,
    marginBottom: 28,
  },
  heroButton: {
    display: "inline-flex",
    alignItems: "center",
    gap: 20,
    color: "#080b16",
    textDecoration: "none",
    padding: "13px 17px",
    borderRadius: 7,
    fontWeight: 800,
    fontSize: 12,
  },
  scrollNote: {
    marginTop: 65,
    fontSize: 9,
    letterSpacing: 2,
    color: "#7e8295",
  },
  siteSection: {
    padding: "65px 7%",
    borderTop: "1px solid #ffffff12",
  },
  sectionEyebrow: {
    color: "#a78bfa",
    fontSize: 9,
    letterSpacing: 2,
    fontWeight: 800,
  },
  sectionTitle: {
    fontSize: "clamp(26px, 3vw, 38px)",
    letterSpacing: -1.2,
    margin: "15px 0 12px",
  },
  sectionDescription: {
    maxWidth: 600,
    color: "#a4a7b9",
    fontSize: 13,
    lineHeight: 1.8,
  },
  contactEmail: {
    fontSize: 13,
    marginTop: 18,
    overflowWrap: "anywhere",
  },
  itemGrid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(170px, 1fr))",
    gap: 12,
    marginTop: 28,
  },
  itemCard: {
    padding: 20,
    border: "1px solid #ffffff19",
    borderRadius: 11,
    background: "linear-gradient(135deg, #ffffff09, #ffffff03)",
  },
  cardSymbol: {
    fontSize: 22,
    marginBottom: 18,
  },
  itemTitle: {
    fontSize: 14,
    margin: "0 0 9px",
    lineHeight: 1.5,
  },
  itemDescription: {
    color: "#a4a7b9",
    fontSize: 12,
    lineHeight: 1.8,
    margin: 0,
  },
  projectLink: {
    display: "inline-block",
    marginTop: 14,
    fontSize: 12,
    fontWeight: 700,
    textDecoration: "none",
  },
  siteFooter: {
    display: "flex",
    flexWrap: "wrap",
    justifyContent: "space-between",
    gap: 12,
    padding: "25px 7%",
    borderTop: "1px solid #ffffff12",
    color: "#9295a8",
    fontSize: 10,
  },
  contentView: {
    background: "#10121b",
    padding: 30,
    minHeight: 600,
    color: "#e5e7eb",
  },
  contentHeading: {
    fontSize: 25,
    margin: "0 0 10px",
  },
  editorSectionHeading: {
    fontSize: 17,
    margin: "0 0 14px",
  },
  editInput: {
    width: "100%",
    boxSizing: "border-box",
    background: "#171925",
    color: "#f4f4fa",
    border: "1px solid #51456f",
    borderRadius: 8,
    padding: 12,
    fontSize: 14,
    marginBottom: 12,
  },
  editTextarea: {
    width: "100%",
    boxSizing: "border-box",
    background: "#171925",
    color: "#f4f4fa",
    border: "1px solid #51456f",
    borderRadius: 8,
    padding: 12,
    fontSize: 13,
    lineHeight: 1.7,
    resize: "vertical",
    marginBottom: 12,
    fontFamily: "inherit",
  },
  contentCard: {
    padding: 18,
    border: "1px solid #343648",
    borderRadius: 10,
    marginTop: 14,
    lineHeight: 1.7,
    fontSize: 13,
    background: "#141621",
  },
  divider: {
    height: 1,
    background: "#343648",
    margin: "26px 0",
  },
  sectionHeaderRow: {
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    gap: 12,
    flexWrap: "wrap",
  },
  sectionNumber: {
    color: "#b5a0ff",
    fontSize: 10,
    fontWeight: 800,
    letterSpacing: 1.5,
  },
  smallButton: {
    background: "#302645",
    color: "#e8ddff",
    border: "1px solid #51456f",
    borderRadius: 7,
    padding: "8px 10px",
    fontSize: 11,
    cursor: "pointer",
  },
  removeButton: {
    background: "transparent",
    color: "#f0a5b3",
    border: "1px solid #713047",
    borderRadius: 6,
    padding: "6px 9px",
    fontSize: 10,
    cursor: "pointer",
  },
  itemsHeadingRow: {
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    gap: 10,
    flexWrap: "wrap",
    marginTop: 20,
  },
  labelInline: {
    fontSize: 10,
    fontWeight: 800,
    letterSpacing: 1.4,
    color: "#c1c2d0",
  },
  itemEditor: {
    borderTop: "1px solid #343648",
    marginTop: 16,
    paddingTop: 12,
  },
  fieldHint: {
    color: "#85889a",
    fontSize: 11,
    lineHeight: 1.6,
  },
};
