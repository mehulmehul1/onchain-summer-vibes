# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with the Wave Pattern System project integrated with the PRP (Product Requirement Prompt) Framework.

## Project Overview

This is a **React TypeScript wave pattern visualization system** that creates animated wave patterns masked to fill vector logo shapes. The system features multiple pattern types, real-time controls, and modular architecture. It's now enhanced with the **PRP Framework** for structured AI-assisted development.

**Core Concept**: This project combines a sophisticated wave pattern system with **"PRP = PRD + curated codebase intelligence + agent/runbook"** - designed to enable AI agents to ship production-ready code on the first pass.

## Core Architecture

### Wave Pattern System Structure
- **Components** (`src/components/`) - UI components including collapsible sidebar controls
- **Hooks** (`src/hooks/`) - Custom React hooks for state management and animation
- **Patterns** (`src/patterns/`) - Individual pattern rendering modules
- **Utils** (`src/utils/`) - Utility functions for colors, math, and canvas operations
- **Constants** (`src/constants/`) - Configuration values and type definitions

### PRP Framework Integration
- **33+ pre-configured Claude Code commands** in `.claude/commands/`
- Commands organized by function:
  - `PRPs/` - PRP creation and execution workflows
  - `development/` - Core development utilities (prime-core, onboarding, debug)
  - `code-quality/` - Review and refactoring commands
  - `rapid-development/experimental/` - Parallel PRP creation and hackathon tools
  - `git-operations/` - Conflict resolution and smart git operations
  - `typescript/` - TypeScript-specific commands

### Template-Based Methodology
- **PRP Templates** in `PRPs/templates/` follow structured format with validation loops
- **Context-Rich Approach**: Every PRP must include comprehensive documentation, examples, and gotchas
- **Validation-First Design**: Each PRP contains executable validation gates (syntax, tests, integration)

### AI Documentation Curation
- `PRPs/ai_docs/` contains curated Claude Code documentation for context injection
- Framework-specific guidelines integrated into this CLAUDE.md

## Key Technologies

- **React 18** with TypeScript
- **Vite** for build tooling
- **Canvas API** for rendering
- **SVG masking** for logo integration
- **RequestAnimationFrame** for smooth animations
- **PRP Framework** for structured AI development

## Pattern System

### Available Patterns
1. **Interference Pattern** - Wave interference with multiple sources
2. **Gentle Pattern** - Flowing sinusoidal lines
3. **Mandala Pattern** - Geometric mandala with breathing animations
4. **Vector Field Pattern** - Particle flow following vector fields

### Pattern Implementation
- Each pattern is a separate module in `src/patterns/`
- Patterns follow the `PatternRenderer` interface
- All patterns support real-time parameter adjustments
- Patterns are masked to fill only the logo shape

## Development Commands

### Build & Development
```bash
npm install          # Install dependencies
npm run dev         # Start development server
npm run build       # Build for production
npm run preview     # Preview production build
```

### Code Quality
```bash
npm run lint        # Run ESLint (if configured)
npm run typecheck   # Run TypeScript checks
```

### PRP Execution
```bash
# Interactive mode (recommended for development)
uv run PRPs/scripts/prp_runner.py --prp [prp-name] --interactive

# Headless mode (for CI/CD)
uv run PRPs/scripts/prp_runner.py --prp [prp-name] --output-format json

# Streaming JSON (for real-time monitoring)
uv run PRPs/scripts/prp_runner.py --prp [prp-name] --output-format stream-json
```

### Key Claude Commands
- `/prp-base-create` - Generate comprehensive PRPs with research
- `/prp-base-execute` - Execute PRPs against codebase
- `/prp-planning-create` - Create planning documents with diagrams
- `/prime-core` - Prime Claude with project context
- `/review-staged-unstaged` - Review git changes using PRP methodology
- `/TS-create-base-prp` - TypeScript-specific PRP creation
- `/TS-execute-base-prp` - TypeScript PRP execution
- `/smart-commit` - Intelligent commit creation
- `/refactor-simple` - Simple refactoring tasks
- `/debug-RCA` - Root cause analysis debugging

## Critical Success Patterns

### The PRP Methodology
1. **Context is King**: Include ALL necessary documentation, examples, and caveats
2. **Validation Loops**: Provide executable tests/lints the AI can run and fix
3. **Information Dense**: Use keywords and patterns from the codebase
4. **Progressive Success**: Start simple, validate, then enhance

### PRP Structure Requirements
- **Goal**: Specific end state and desires
- **Why**: Business value and user impact
- **What**: User-visible behavior and technical requirements
- **All Needed Context**: Documentation URLs, code examples, gotchas, patterns
- **Implementation Blueprint**: Pseudocode with critical details and task lists
- **Validation Loop**: Executable commands for syntax, tests, integration

### Wave Pattern Validation Gates (Must be Executable)
```bash
# Level 1: Syntax & Style
npm run build        # TypeScript compilation
npm run typecheck    # Type checking
npm run lint         # ESLint (if configured)

# Level 2: Unit Tests
npm test             # Run unit tests (if configured)

# Level 3: Integration & Visual
npm run dev          # Start dev server
# Manual testing of pattern switching
# Visual validation of animations
# Performance testing (60fps requirement)

# Level 4: Build & Deploy
npm run build        # Production build
npm run preview      # Test production build
```

## Key Development Patterns

### Adding New Patterns
1. Create pattern renderer in `src/patterns/NewPattern.ts`
2. Export from `src/patterns/index.ts`
3. Add pattern type to `src/constants/patternConfig.ts`
4. Update animation logic in `src/hooks/useCanvasAnimation.ts`
5. Add controls in `src/components/PatternControls.tsx`

### State Management
- Use `usePatternState` hook for all pattern-related state
- State is passed down through props, not global
- Animation parameters are managed via refs to avoid re-renders

### Performance Considerations
- Animation loop uses `requestAnimationFrame`
- Canvas operations are optimized with sampling
- SVG masks are cached and reused
- Lines are pooled for vector field pattern

## File Structure Guidelines

### Component Organization
```
src/components/
├── WaveCanvas.tsx          # Canvas rendering component
├── ControlPanel.tsx        # Collapsible sidebar with controls
├── PatternControls.tsx     # Pattern-specific controls
└── ThemeControls.tsx       # Color themes and palette
```

### Hook Organization
```
src/hooks/
├── useCanvasAnimation.ts   # Animation loop and rendering
├── usePatternState.ts      # Pattern state management
└── useSVGMask.ts          # SVG mask creation and caching
```

### Pattern Organization
```
src/patterns/
├── InterferencePattern.ts  # Wave interference
├── GentlePattern.ts        # Flowing lines
├── MandalaPattern.ts       # Geometric mandala
├── VectorFieldPattern.ts   # Vector field flow
├── types.ts               # Pattern interfaces
└── index.ts               # Pattern exports
```

### PRP Structure
```
PRPs/
├── templates/              # PRP templates with validation
├── scripts/               # PRP runner and utilities
├── ai_docs/               # Curated Claude Code documentation
├── completed/             # Finished PRPs (create as needed)
└── *.md                   # Active PRPs
```

## Coding Standards

### TypeScript
- Use strict TypeScript configuration
- Define interfaces for all pattern parameters
- Use proper typing for all functions and variables
- Avoid `any` type unless absolutely necessary

### React Patterns
- Use functional components with hooks
- Prefer `useCallback` for stable function references
- Use `useRef` for values that don't trigger re-renders
- Implement proper cleanup in `useEffect`

### Performance
- Minimize re-renders with proper dependency arrays
- Use refs for animation-related values
- Implement efficient canvas operations
- Pool objects where possible (e.g., particle systems)

### Code Organization
- Keep files focused on single responsibilities
- Use barrel exports (`index.ts`) for clean imports
- Group related utilities together
- Maintain consistent naming conventions

## SVG Logo Integration

### Current Logo
- Uses "Onchain Summer" SVG path
- Scaled to 70% of viewport
- Centered positioning
- White fill for masking

### Replacing Logo
1. Update `SVG_CONFIG` in `src/constants/patternConfig.ts`
2. Ensure new SVG has white fill
3. Update viewBox and dimensions
4. Test with all pattern types

## Animation System

### Core Loop
- Single `requestAnimationFrame` loop
- Time-based animations using `timeRef`
- Smooth transitions between patterns
- Proper cleanup on component unmount

### Pattern Rendering
- Each pattern renders to temporary canvas
- SVG mask applied pixel-by-pixel
- Efficient sampling for performance
- Support for different blend modes

## UI/UX Guidelines

### Collapsible Sidebar
- Gear icon toggle button
- Slides in from right
- Backdrop overlay when open
- Keyboard shortcuts (Ctrl/Cmd+C, Escape)

### Control Organization
- Pattern type selection first
- Pattern-specific controls shown dynamically
- Theme presets for quick color changes
- Individual color pickers for fine-tuning

### Responsive Design
- Works on desktop and mobile
- Touch-friendly controls
- Adaptive sizing based on screen size
- Maintains aspect ratio

## Working with This Framework

### When Creating New PRPs
1. **Context Process**: New PRPs must consist of context sections, Context is King!
2. **Use `/prp-base-create [feature-description]`** for comprehensive PRP generation
3. **Include Wave Pattern Context**: Reference existing patterns, animation system, and UI patterns
4. **TypeScript-Specific**: Use `/TS-create-base-prp` for TypeScript features

### When Executing PRPs
1. **Load PRP**: Read and understand all context and requirements
2. **ULTRATHINK**: Create comprehensive plan, break down into todos, use subagents, batch tool etc check PRPs/ai_docs/
3. **Execute**: Implement following the blueprint
4. **Validate**: Run each validation command, fix failures
5. **Complete**: Ensure all checklist items done

### Command Usage
- Read the `.claude/commands/` directory
- Access via `/` prefix in Claude Code
- Commands are self-documenting with argument placeholders
- Use parallel creation commands for rapid development
- Leverage existing review and refactoring commands

## Common Patterns

### Adding New Controls
1. Add state to `usePatternState` hook
2. Add control to appropriate component
3. Pass through props to components
4. Update animation hook dependencies

### Debugging Animation Issues
- Check console for animation errors
- Verify pattern type comparisons
- Ensure proper cleanup in useEffect
- Check for infinite re-render loops

### Performance Optimization
- Use adaptive sampling for large screens
- Implement object pooling for particles
- Cache expensive calculations
- Minimize canvas operations

## Anti-Patterns to Avoid

### PRP Anti-Patterns
- Don't create minimal context prompts - context is everything - the PRP must be comprehensive and self-contained, reference relevant documentation and examples
- Don't skip validation steps - they're critical for one-pass success - The better the AI is at running the validation loop, the more likely it is to succeed
- Don't ignore the structured PRP format - it's battle-tested
- Don't create new patterns when existing templates work
- Don't hardcode values that should be config
- Don't catch all exceptions - be specific

### React Anti-Patterns
- Don't put animation values in state (use refs)
- Don't recreate functions on every render
- Don't ignore useEffect dependencies
- Don't perform side effects in render

### Performance Anti-Patterns
- Don't create new objects in render loops
- Don't use string concatenation in hot paths
- Don't ignore canvas optimization techniques
- Don't create memory leaks in animations

### Architecture Anti-Patterns
- Don't couple pattern logic with UI components
- Don't hardcode configuration values
- Don't bypass the pattern renderer interface
- Don't ignore proper error handling

## Testing Strategy

### Unit Testing
- Test individual pattern renderers
- Test utility functions
- Test hook behavior
- Mock canvas operations

### Integration Testing
- Test pattern switching
- Test control interactions
- Test responsive behavior
- Test performance under load

### Visual Testing
- Verify pattern accuracy
- Check color transitions
- Validate logo masking
- Test animation smoothness

## Project Structure Understanding

```
wave-pattern-system/
├── .claude/
│   ├── commands/           # 33+ Claude Code commands
│   └── settings.local.json # Tool permissions
├── PRPs/
│   ├── templates/          # PRP templates with validation
│   ├── scripts/           # PRP runner and utilities
│   ├── ai_docs/           # Curated Claude Code documentation
│   ├── completed/         # Finished PRPs
│   └── *.md               # Active PRPs
├── src/
│   ├── components/        # React components
│   ├── hooks/            # Custom hooks
│   ├── patterns/         # Pattern renderers
│   ├── utils/            # Utility functions
│   └── constants/        # Configuration
├── CLAUDE.md             # This file
├── package.json          # Dependencies
├── tsconfig.json         # TypeScript config
└── vite.config.ts        # Vite configuration
```

## PRP Workflow Example

### Creating a New Feature
```bash
# 1. Create PRP for new feature
/prp-base-create add keyboard shortcuts for pattern switching

# 2. Execute the PRP
/prp-base-execute PRPs/keyboard-shortcuts.md

# 3. Review the changes
/review-staged-unstaged

# 4. Commit with context
/smart-commit
```

## Remember

This is a **modular, performant wave pattern system** designed for real-time interaction and visual excellence, enhanced with the **PRP Framework** for structured AI development. Every change should maintain the smooth 60fps animation and responsive user experience.

The framework is about **one-pass implementation success through comprehensive context and validation**. Every PRP should contain the exact context for an AI agent to successfully implement working code in a single pass while maintaining the wave pattern system's performance and architectural standards.