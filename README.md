# Portfolio Website

A high-performance, responsive portfolio website built with vanilla HTML5, CSS3, and JavaScript. Features a dark-mode-first design with glassmorphism effects and a futuristic aesthetic.

## 🚀 Features

- **Single-page application** with smooth scrolling navigation
- **Dark/Light theme toggle** with user preference persistence
- **Glassmorphism design** with backdrop-filter effects
- **Responsive layout** that works on all devices
- **Dynamic content loading** from JSON files
- **Accessibility compliant** with ARIA support and keyboard navigation
- **Performance optimized** with lazy loading and efficient animations
- **Contact form** with client-side validation
- **SEO friendly** with proper meta tags and Open Graph support

## 🛠️ Technology Stack

- **HTML5** - Semantic markup and accessibility
- **CSS3** - Modern styling with CSS Grid, Flexbox, and custom properties
- **Vanilla JavaScript** - No frameworks, pure ES6+ features
- **JSON** - Dynamic content management

## 📁 Project Structure

```
Portfolio/
├── index.html              # Main HTML file
├── styles.css              # Main stylesheet
├── app.js                  # JavaScript functionality
├── assets/                 # Static assets
│   ├── README.txt          # Asset guidelines
│   ├── resume.pdf          # Downloadable resume
│   └── [images]            # Profile and project images
├── data/                   # JSON data files
│   ├── projects.json       # Project information
│   ├── skills.json         # Skills and technologies
│   └── posts.json          # Blog posts metadata
└── posts/                  # Blog post content
    └── *.md                # Markdown files for blog posts
```

## 🚀 Quick Start

### Prerequisites

You need a local web server to run this portfolio because it uses `fetch()` to load JSON files, which is blocked by browsers when opening files directly.

### Option 1: Using Node.js

```bash
# Install http-server globally
npm install -g http-server

# Navigate to your portfolio directory
cd Portfolio

# Start the server
http-server

# Open http://localhost:8080 in your browser
```

### Option 2: Using Python

```bash
# Navigate to your portfolio directory
cd Portfolio

# Python 3
python -m http.server 8000

# Python 2
python -m SimpleHTTPServer 8000

# Open http://localhost:8000 in your browser
```

### Option 3: Using VS Code Live Server

1. Install the "Live Server" extension in VS Code
2. Right-click on `index.html`
3. Select "Open with Live Server"

## ✏️ Customization

### Adding New Projects

Edit `data/projects.json` and add your project information:

```json
{
  "id": "unique-project-id",
  "title": "Project Title",
  "description": "Short description",
  "fullDescription": "Detailed description for modal",
  "thumbnail": "./assets/project-image.jpg",
  "technologies": ["React", "Node.js", "MongoDB"],
  "features": ["Feature 1", "Feature 2"],
  "liveUrl": "https://your-project.com",
  "repoUrl": "https://github.com/username/repo",
  "date": "2024-01-01"
}
```

### Adding New Skills

Edit `data/skills.json`:

```json
{
  "name": "Skill Name",
  "category": "Frontend|Backend|Database|Tools",
  "level": 85,
  "icon": "🚀"
}
```

### Adding Blog Posts

1. Edit `data/posts.json` with post metadata
2. Create a `.md` file in the `posts/` directory
3. The app will automatically load and display the content

### Customizing Colors

Modify CSS variables in `styles.css`:

```css
:root {
  --accent-primary: #your-color;
  --accent-secondary: #your-color;
  /* Add more custom colors */
}
```

### Personal Information

Update the following in `index.html`:

- Meta tags (title, description, author)
- Hero section (name, role, tagline)
- About section (bio, social links)
- Contact information

## 🎨 Assets Setup

### Required Images

Place these files in the `assets/` directory:

- `profile.jpg` - Your profile photo (400x400px recommended)
- `project1.jpg`, `project2.jpg`, etc. - Project thumbnails (600x400px)
- `favicon.ico` - Website favicon
- `og-image.jpg` - Social media preview image (1200x630px)

### Responsive Images

For optimal performance, create multiple sizes:

- `project1-320w.jpg` (mobile)
- `project1-640w.jpg` (tablet)
- `project1-1024w.jpg` (desktop)

## ⚡ Performance Features

- **GPU-accelerated animations** using `transform` and `opacity`
- **Intersection Observer** for scroll-triggered animations
- **Lazy loading** for images
- **Efficient event delegation** to minimize memory usage
- **Debounced scroll events** to improve performance
- **CSS containment** for better rendering optimization

## 🔧 Browser Support

- Chrome/Edge 88+
- Firefox 84+
- Safari 14+
- Mobile browsers with ES6 support

## 📱 Responsive Breakpoints

- Mobile: < 768px
- Tablet: 768px - 1024px
- Desktop: > 1024px

## ♿ Accessibility Features

- Semantic HTML structure
- ARIA labels and roles
- Keyboard navigation support
- Screen reader friendly
- High contrast mode support
- Reduced motion preferences

## 🎹 Keyboard Shortcuts

- `C` - Jump to contact section
- `Esc` - Close modals
- `Tab`/`Shift+Tab` - Navigate focusable elements

## 🐛 Troubleshooting

### Common Issues

1. **Images not loading**: Check file paths in JSON files
2. **Fetch errors**: Ensure you're using a local server, not opening files directly
3. **Animations not working**: Check if browser supports backdrop-filter
4. **Contact form not submitting**: This is expected - it's a demo form

### Browser Developer Tools

Use browser dev tools to:

- Check console for errors
- Inspect network requests
- Debug responsive design
- Test accessibility

## 📄 License

This project is open source and available under the [MIT License](LICENSE).

## 🤝 Contributing

Feel free to submit issues and enhancement requests!

---

**Note**: This portfolio is designed to be easily customizable while maintaining high performance and accessibility standards. The modular architecture allows you to modify individual components without affecting the entire application.

For questions or support, please check the documentation comments in the source files or create an issue in the repository.
"# My_Portfolio" 
"# My_Portfolio" 
"# My_Portfolio" 
"# My_Portfolio" 
