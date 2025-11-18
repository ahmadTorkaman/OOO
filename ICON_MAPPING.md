# Icon Mapping - Emoji to Lucide Icons

This document shows all the emoji-to-icon replacements made in the ValueFlow visualization.

## Employee Roles

| Emoji | Lucide Icon | Size | Color | Usage |
|-------|------------|------|-------|-------|
| 👨‍🎨 | `palette` | 32px | #3498db (blue) | Designer |
| 👨‍💻 | `cpu` | 32px | #2ecc71 (green) | Engineer |
| 👨‍🏭 | `cog` | 32px | #f39c12 (orange) | Operator |
| 👨‍💼 | `briefcase` | 32px | #9b59b6 (purple) | Manager |
| 🛒 | `shopping-cart` | 32px | #e74c3c (red) | Commerce |
| 📈 | `trending-up` | 32px | #16a085 (teal) | Sales |

## Metric Types (OZONE Core)

| Emoji | Lucide Icon | Size | Color | Usage |
|-------|------------|------|-------|-------|
| 📊 | `bar-chart-2` | 24px | default | KPI Tracking |
| 📦 | `package` | 24px | default | MRP System |
| ⚙️ | `settings` | 24px | default | BPM Engine |

## Metric Card Headers

| Emoji | Lucide Icon | Size | Color | Usage |
|-------|------------|------|-------|-------|
| 📊 | `activity` | 48px | #3498db | KPI Card |
| 📦 | `box` | 48px | #2ecc71 | MRP Card |
| ⚙️ | `zap` | 48px | #f39c12 | BPM Card |

## Output Nodes & Section Headers

| Emoji | Lucide Icon | Size | Color | Usage |
|-------|------------|------|-------|-------|
| 🏢 | `building-2` | 20-24px | default | Company Benefits |
| 👥 | `users` | 20-24px | default | Employee Benefits |
| 👤 | `user` | 16px | default | Individual Employee (Sarah) |

## Company Benefits Icons

| Emoji | Lucide Icon | Size | Benefit |
|-------|------------|------|---------|
| 💰 | `dollar-sign` | 24px | 34% cost reduction |
| 📈 | `trending-up` | 24px | 73% faster time-to-market |
| 🎯 | `target` | 24px | 89% fewer errors |
| 📊 | `bar-chart-2` | 24px | Real-time visibility |
| 🔄 | `refresh-cw` | 24px | Zero data loss |
| 🤖 | `cpu` | 24px | AI-driven decisions |
| 🌍 | `globe` | 24px | Global coordination |

## Employee Benefits Icons

| Emoji | Lucide Icon | Size | Benefit |
|-------|------------|------|---------|
| 💵 | `coins` | 24px | Performance bonuses |
| 🎓 | `graduation-cap` | 24px | Skill development insights |
| ⚖️ | `scale` | 24px | Fair workload distribution |
| 👁️ | `eye` | 24px | Complete transparency |
| 🏆 | `award` | 24px | Recognition & credit |
| 🛠️ | `wrench` | 24px | Better tools & resources |
| 🤝 | `handshake` | 24px | Easier collaboration |

## Implementation Details

### React Component
A custom `LucideIcon` component wraps the Lucide library:

```javascript
function LucideIcon({ name, size = 24, color, className = '', style = {} }) {
  const iconRef = useRef(null);

  useEffect(() => {
    if (iconRef.current && window.lucide) {
      iconRef.current.innerHTML = '';
      const iconElement = window.lucide.createElement(name);
      if (iconElement) {
        iconRef.current.appendChild(iconElement);
        const svg = iconRef.current.querySelector('svg');
        if (svg) {
          svg.setAttribute('width', size);
          svg.setAttribute('height', size);
          if (color) {
            svg.setAttribute('stroke', color);
          }
        }
      }
    }
  }, [name, size, color]);

  return h('i', {
    ref: iconRef,
    className: `lucide-icon ${className}`,
    style: { display: 'inline-flex', alignItems: 'center', justifyContent: 'center', ...style }
  });
}
```

### CDN Import
```html
<script src="https://unpkg.com/lucide@latest/dist/umd/lucide.min.js"></script>
```

### CSS Updates
```css
.lucide-icon {
  display: inline-flex;
  align-items: center;
  justify-content: center;
}

.lucide-icon svg {
  display: block;
}
```

## Benefits of Using Lucide Icons

1. **Consistency**: Same icon library as manager dashboard
2. **Professional**: Vector graphics look crisp at any size
3. **Customizable**: Full control over size, color, stroke width
4. **Cross-platform**: No emoji rendering differences between OS
5. **Accessible**: Better for screen readers than emoji
6. **Lightweight**: SVG icons are smaller than emoji fonts
7. **Future-proof**: Easier to update or change icons

## Icon Selection Rationale

- **Employee roles**: Icons represent their tools (palette, CPU, cog, briefcase)
- **Metrics**: Visual metaphors for tracking, packages, and processes
- **Benefits**: Direct visual representation of each benefit
- **Consistent sizing**: Larger icons (48px) for card headers, medium (24-32px) for primary elements, small (16-20px) for inline use

---

**Total Icons Used**: 28 unique Lucide icons
**Total Replacements**: ~50+ instances throughout the visualization
