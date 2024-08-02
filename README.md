Here's a README for your Next.js app:

---

# Pantry Assistant

## Overview

Pantry Assistant is a Next.js application that helps you manage your pantry by allowing you to add, remove, and search through items. The app connects to LLaMA 3.1 8B to generate recipes based on the items in your pantry, making meal planning easier and more efficient. Future updates will include object detection capabilities to automatically add pantry items from pictures.

## Features

- **Add Items**: Easily add new items to your pantry inventory.
- **Remove Items**: Remove items from your pantry when they are used or expired.
- **Search**: Quickly search through your pantry to find items.
- **Recipe Generation**: Get recipe suggestions based on the ingredients you have in your pantry using Gemini 1.5 Pro LLaMA 3.1 8B.
- **Planned Updates**: Integration of object detection to automatically add items from pictures.

## Technologies Used

- **Next.js**: A React framework for server-side rendering and static site generation.
- **Firebase**: For user authentication and database management.
- **Gemini 1.5 Pro & LLaMA 3.1 8B**: To generate recipes based on pantry contents.
- **Material-UI**: For the application's UI components.

## Getting Started

To get started with the Pantry Assistant app, follow these steps:

1. **Clone the Repository**

   ```bash
   git clone https://github.com/your-username/pantry-assistant.git
   cd pantry-assistant
   ```

2. **Install Dependencies**

   Make sure you have [Node.js](https://nodejs.org/) installed, then run:

   ```bash
   npm install
   ```

3. **Set Up Firebase**

   - Create a Firebase project in the [Firebase Console](https://console.firebase.google.com/).
   - Add Firebase configuration to your project. Update `firebase/config.js` with your Firebase project credentials.

4. **Set Up Environment Variables**

   Create a `.env.local` file in the root of the project and add your environment variables:

   ```env
   NEXT_PUBLIC_FIREBASE_API_KEY=your-api-key
   NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your-auth-domain
   NEXT_PUBLIC_FIREBASE_PROJECT_ID=your-project-id
   NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your-storage-bucket
   NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=your-messaging-sender-id
   NEXT_PUBLIC_FIREBASE_APP_ID=your-app-id
   OPENROUTER_API_KEY=you-openrouter-api-key
   ```

5. **Run the Development Server**

   ```bash
   npm run dev
   ```

   Open `http://localhost:3000` in your browser to view the app.

## Usage

1. **Adding Items**: Use the interface to input and add new items to your pantry.
2. **Removing Items**: Select items from your pantry list to remove them.
3. **Searching**: Use the search functionality to find specific items in your pantry.
4. **Recipe Generation**: View recipe suggestions based on the current items in your pantry.

## Planned Updates

- **Object Detection**: Integration of object detection to automatically add pantry items from pictures.
- **UI Updates**: The current UI uses basic materialUI. Functionality has been a focus, but this will be updated.

## Contributing

Contributions are welcome! If you have any suggestions or find issues, please open an issue or submit a pull request.

## License

This project is licensed under the [MIT License](LICENSE).

## Contact

For any questions or feedback, feel free to contact [lefevrekirk@gmail.com](mailto:lefevrekirk@gmail.com).