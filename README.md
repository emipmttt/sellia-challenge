# Sellia Challenge

## Project Setup

Follow these steps to get the project up and running locally:

### Install Dependencies

```sh
npm install
```

### Compile and Hot-Reload for Development

```sh
npm run dev
```

### Type-Check, Compile and Minify for Production

```sh
npm run build
```

### Architectural Decisions

*   **Vue 3 Composition API**: Utilized for better code organization, reusability, and reactivity management.
*   **Vite**: Chosen as the build tool for its fast cold start times and instant hot module replacement.
*   **TypeScript**: Adopted for type safety, improved maintainability, and better developer experience.

### Design Patterns

*   **Service Pattern**: Services (e.g., `auth.ts`, `clients.ts`, `conversations.ts`) are used to encapsulate business logic and data fetching, promoting separation of concerns.
*   **Component-Based Architecture**: The UI is broken down into reusable components, following Vue's recommended practices.

### Libraries Used

*   **Vue Router**: For client-side routing.
*   **Pinia**: As the state management library, offering a simpler and more intuitive API compared to Vuex.
*   **date-fns**: For date manipulation and formatting.
*   **Heroicons**: For SVG icons.
*   **Vitest**: For unit testing.
*   **Sass**: For CSS pre-processing.

### Project Structure

*   `src/components`: Reusable UI components.
*   `src/services`: Business logic and API interactions.
*   `src/views`: Top-level components representing different pages/views.
*   `src/router`: Vue Router configuration.
*   `src/stores`: Pinia stores for state management.
*   `src/styles`: Global SCSS styles.
*   `tests`: Unit tests for components and services.

### Run Unit Tests with [Vitest](https://vitest.dev/)

```sh
npm run test:unit
```

