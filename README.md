# Sellia Challenge


### Features
- Authentication
- Dark mode
- Font size control
- Responsive design
- List of conversations
    - Last message time
    - Last message preview
- Conversations View
    - Message list
    - Message input
    - Send button
    - Attach files of type image, video and docs.
    - Display image, video and docs in the message list.
    - Display parsed buttons in the message list.

### Screenshots

<img width="1239" height="846" alt="Screenshot 6" src="https://github.com/user-attachments/assets/c587bec5-a418-4521-b511-de6590908a20" />
<img width="1222" height="846" alt="Screenshot 5" src="https://github.com/user-attachments/assets/63270f69-2bb4-4db6-8daa-688b29066ca7" />
<img width="1230" height="852" alt="Screenshot 4" src="https://github.com/user-attachments/assets/bc8a167d-3a63-4dae-8c32-258db7cc616d" />
<img width="437" height="849" alt="Screenshot 3" src="https://github.com/user-attachments/assets/f1c3e13d-c24e-45fb-8ec2-599cc4afb8ab" />
<img width="478" height="847" alt="Screenshot 2" src="https://github.com/user-attachments/assets/f36d9b33-48d6-4712-8c9b-a7db9ab689ab" />
<img width="1240" height="852" alt="Screenshot 1" src="https://github.com/user-attachments/assets/9aeb5656-5d05-45fb-b30e-36a1d15090fb" />

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

### Deploy

Deployment is handled by GitHub Actions, we configured it in the .github/workflows/deploy.yml file.

First it builds the project, then it deploys it to GitHub Pages to the gh-pages branch.
Demo Available at: https://emipmttt.github.io/sellia-challenge/

### Design 
Design available at: https://www.figma.com/design/qrE6Q17Z1UfEli9yKJja5A/Sellia?node-id=0-1&t=7IsTNpVplV5VXMo6-1


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
