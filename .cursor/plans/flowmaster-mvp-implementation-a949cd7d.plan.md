<!-- a949cd7d-4489-46b0-8bba-3edb20f2a1ed dbbdb41f-d140-48ee-bde8-c4b1fb32c211 -->
# FlowMaster MVP Implementation Plan

## Phase 1: Project Setup & Configuration

### 1.1 Initialize Vite + React Project

- Create Vite React project with TypeScript support (or JavaScript based on preference)
- Install core dependencies: react-router-dom, framer-motion
- Install styling: tailwindcss, postcss, autoprefixer
- Install API: @google/generative-ai
- Install utilities: react-icons, react-syntax-highlighter (optional)

### 1.2 Tailwind Configuration

- Configure `tailwind.config.js` with custom color palette (--bg-primary, --accent-primary, etc.)
- Add custom neumorphic shadow utilities
- Configure glassmorphism backdrop-filter support
- Set up border-radius scale (20px, 16px, 12px, 24px)
- Configure font family (Inter) and typography scale

### 1.3 Project Structure

- Create directory structure:
  - `src/pages/` (LandingPage, InputPage, WorkflowPage)
  - `src/components/layout/` (GlassCard, NeumorphicButton)
  - `src/components/input/` (IdeaInput, LoadingSpinner)
  - `src/components/workflow/` (WorkflowGrid, CurrentStepCard, ShowcasePanel, AgentMessage, CriticMessage, ImproverMessage, WorkflowStepper)
  - `src/services/` (gemini.js)
  - `src/hooks/` (useWorkflowSimulation.js)
  - `src/utils/` (constants.js)

### 1.4 Environment Setup

- Create `.env.example` with `VITE_GEMINI_API_KEY`
- Add `.env` to `.gitignore`
- Document environment variable setup in README

## Phase 2: Design System & Base Components

### 2.1 Global Styles

- Create `src/index.css` with:
  - CSS custom properties for color palette
  - Neumorphic shadow classes
  - Glassmorphism utility classes
  - Global animations (float, pulse-glow, shake, success-bounce)
  - Base typography styles
  - Dark mode base styles

### 2.2 Reusable Components

- **GlassCard.jsx**: Glassmorphic card with hover effects, glow support
- **NeumorphicButton.jsx**: Button with neumorphic shadows, gradient support, loading states
- **LoadingSpinner.jsx**: Animated spinner component

### 2.3 Constants & Utilities

- **constants.js**: Agent configurations (names, colors, icons), phase timings, agent colors mapping

## Phase 3: Landing Page

### 3.1 Particle Background

- Create `ParticleBackground` component with 50 animated cyan particles
- Implement floating animation (4s, ease-in-out, infinite)
- Add 3-5 geometric glassmorphic shapes with parallax effect

### 3.2 Hero Content

- Gradient title "FlowMaster" with text shadow glow
- Tagline and description text
- Staggered fade-in animations for text elements
- CTA button with continuous pulse animation
- Navigation to `/create` on button click

## Phase 4: Input Page

### 4.1 Input Card Component

- Glassmorphic card with centered layout
- Header with title and subtitle
- Input area with three modes:
  - Text input (functional textarea)
  - Image upload icon (UI placeholder for MVP)
  - Voice input icon (UI placeholder for MVP)
- Icon hover effects and labels
- Focus state with cyan glow

### 4.2 Submit Functionality

- Submit button with gradient background
- Disabled state when input empty
- Loading state with spinner and "Processing..." text
- Error handling and display

### 4.3 API Integration (Gemini)

- **gemini.js**: `generateWorkflow(userIdea)` function
- Single comprehensive API call to generate all agent outputs
- JSON parsing and error handling
- Prompt engineering for structured workflow data

## Phase 5: Workflow Page

### 5.1 Layout Structure

- Top bar with "Previous Step" button and user prompt card
- 3-column responsive grid (25% | 45% | 30%)
- Mobile: Stack vertically
- Tablet: 2-column layout

### 5.2 Left Column Components

- **CurrentStepCard**: Highlighted card with pulse glow, agent info, status
- **AgentThoughtBits**: Scrollable list of thoughts with stagger animations
- **NextStepCard**: Grayed-out preview of next step

### 5.3 Center Column - Showcase Panel

- **ShowcasePanel**: Main conversation log container
- Header with title and subtitle
- Messages area with auto-scroll
- **AgentMessage**: Main agent message bubbles with:
  - Colored avatars (by agent type)
  - Message header (name + timestamp)
  - Message body with code syntax highlighting
  - Artifact pills display
- **CriticMessage**: Nested critic review (indented, red theme)
- **ImproverMessage**: Nested improver refinement (indented, amber theme)
- Connecting lines for nested messages

### 5.4 Right Column - Workflow Stepper

- **WorkflowStepper**: Vertical progress indicator
- Animated progress line (gradient fill)
- 7 step circles with status (completed/active/pending)
- Sub-phase indicators for Initial Output, Critic Review, Improvement
- Pulse animation for active step
- Checkmark icons for completed steps

### 5.5 Simulation Logic

- **useWorkflowSimulation.js** hook:
  - Progressive display of pre-generated workflow data
  - Sequential agent execution with delays
  - Phase-by-phase message addition
  - State management (currentStep, currentPhase, messages, isComplete)

## Phase 6: Animations & Interactions

### 6.1 Page Transitions

- Framer Motion page transitions (slide + fade)
- Enter/exit animations

### 6.2 Component Animations

- Message slide-in animations (staggered)
- Card hover effects (scale + glow)
- Button click animations (scale down)
- Status change animations (color transition + bounce)
- Progress fill animations

### 6.3 Micro-interactions

- Input focus glow
- Icon hover scale
- Artifact pill hover effects
- Auto-scroll to latest message

## Phase 7: Responsive Design

### 7.1 Breakpoints

- Mobile (< 768px): Stack columns, hide particles, full-width buttons
- Tablet (768px - 1024px): 2-column layout
- Desktop (> 1024px): Full 3-column layout

### 7.2 Mobile Optimizations

- Scaled font sizes (20% reduction)
- Reduced padding (12px)
- Touch-friendly button sizes
- Simplified animations for performance

## Phase 8: Error Handling & Edge Cases

### 8.1 API Error Handling

- Invalid API key errors
- Rate limit errors
- Network errors
- JSON parsing errors

### 8.2 UI Error States

- Error message display on Input page
- Fallback UI for missing workflow data
- Loading state management

## Phase 9: Testing & Polish

### 9.1 Functionality Testing

- Landing page navigation
- Input page submission
- Workflow simulation progression
- Message rendering
- Progress tracking

### 9.2 Visual Polish

- Consistent spacing and alignment
- Smooth 60fps animations
- Color contrast verification
- Cross-browser compatibility

### 9.3 Performance Optimization

- Lazy loading for WorkflowPage
- Memoization for message components
- Debounced input (if needed)
- Optimized re-renders

## File Structure Summary

```
src/
├── pages/
│   ├── LandingPage.jsx
│   ├── InputPage.jsx
│   └── WorkflowPage.jsx
├── components/
│   ├── layout/
│   │   ├── GlassCard.jsx
│   │   └── NeumorphicButton.jsx
│   ├── input/
│   │   ├── IdeaInput.jsx
│   │   └── LoadingSpinner.jsx
│   ├── workflow/
│   │   ├── WorkflowGrid.jsx
│   │   ├── CurrentStepCard.jsx
│   │   ├── ShowcasePanel.jsx
│   │   ├── AgentMessage.jsx
│   │   ├── CriticMessage.jsx
│   │   ├── ImproverMessage.jsx
│   │   └── WorkflowStepper.jsx
│   └── common/
│       └── ParticleBackground.jsx
├── services/
│   └── gemini.js
├── hooks/
│   └── useWorkflowSimulation.js
├── utils/
│   └── constants.js
├── App.jsx
├── main.jsx
└── index.css
```

## Key Implementation Notes

1. **API Strategy**: Single comprehensive Gemini API call generates all 7 agents' outputs at once, then simulation hook displays them progressively with delays
2. **Image/Voice Input**: UI placeholders for MVP (icons visible, not functional)
3. **Design System**: Strict adherence to color palette and neumorphic/glassmorphic styling
4. **Animations**: Use Framer Motion for all animations, CSS for base styles
5. **Responsive**: Mobile-first approach with breakpoint-specific layouts

### To-dos

- [ ] Initialize Vite + React project, install dependencies (react-router-dom, framer-motion, tailwindcss, @google/generative-ai, react-icons)
- [ ] Configure Tailwind with custom colors, neumorphic shadows, glassmorphism utilities, and typography
- [ ] Create directory structure (pages, components, services, hooks, utils)
- [ ] Create index.css with CSS variables, neumorphic shadows, glassmorphism classes, and animations
- [ ] Build GlassCard, NeumorphicButton, and LoadingSpinner reusable components
- [ ] Create constants.js with agent configurations, colors, and phase timings
- [ ] Build LandingPage with particle background, hero content, and CTA button
- [ ] Build InputPage with glassmorphic card, text/image/voice input UI, and submit functionality
- [ ] Create gemini.js service with generateWorkflow function for API integration
- [ ] Create useWorkflowSimulation hook for progressive workflow display with delays
- [ ] Build WorkflowPage layout with top bar and 3-column responsive grid
- [ ] Build CurrentStepCard, AgentThoughtBits, and NextStepCard components
- [ ] Build ShowcasePanel, AgentMessage, CriticMessage, and ImproverMessage components
- [ ] Build WorkflowStepper with vertical progress, step circles, and sub-phase indicators
- [ ] Add Framer Motion animations for page transitions, messages, and interactions
- [ ] Implement responsive design for mobile, tablet, and desktop breakpoints
- [ ] Add error handling for API calls, missing data, and edge cases
- [ ] Polish UI, test functionality, optimize performance, and verify cross-browser compatibility