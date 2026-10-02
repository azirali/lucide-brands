import { StrictMode, useState } from 'react';
import { createRoot } from 'react-dom/client';
import { LucideProvider, Mail, Send } from 'lucide-react';
import {
  Chromium, Codepen, Codesandbox, Dribbble, Facebook, Figma, Framer, Github, Gitlab,
  Instagram, Linkedin, Pocket, Slack, Trello, Twitch, Twitter, Youtube,
} from 'lucide-brands';

const brands = {
  Chromium, Codepen, Codesandbox, Dribbble, Facebook, Figma, Framer, Github, Gitlab,
  Instagram, Linkedin, Pocket, Slack, Trello, Twitch, Twitter, Youtube,
};

function App() {
  const [size, setSize] = useState(32);
  const [strokeWidth, setStrokeWidth] = useState(2);

  return (
    <main style={{ fontFamily: 'system-ui, sans-serif', maxWidth: 760, margin: '40px auto', padding: '0 16px' }}>
      <h1>lucide-brands</h1>
      <p>
        Brand icons from <code>lucide-brands</code> next to regular icons from <code>lucide-react</code>{' '}
        (<Mail size={16} /> <Send size={16} />), sharing one <code>LucideProvider</code>.
      </p>
      <label>
        Size {size}px <input type="range" min="16" max="64" value={size} onChange={(e) => setSize(+e.target.value)} />
      </label>{' '}
      <label>
        Stroke {strokeWidth}{' '}
        <input type="range" min="0.5" max="3" step="0.25" value={strokeWidth} onChange={(e) => setStrokeWidth(+e.target.value)} />
      </label>
      <LucideProvider size={size} strokeWidth={strokeWidth}>
        <ul style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(120px, 1fr))', gap: 16, padding: 0, listStyle: 'none' }}>
          {Object.entries(brands).map(([name, Icon]) => (
            <li key={name} style={{ display: 'grid', justifyItems: 'center', gap: 8, padding: 16, border: '1px solid #ddd', borderRadius: 12 }}>
              <Icon />
              <code>{name}</code>
            </li>
          ))}
        </ul>
      </LucideProvider>
    </main>
  );
}

createRoot(document.getElementById('root')).render(<StrictMode><App /></StrictMode>);
