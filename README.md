# xaropes.pt

This is a handy tool to calculate pediatrics doses of syrups.

## Disclaimer

I build this tool because I wanted to try the new release of React Router v7, and also because I needed an app to try some kubernetes deployment ideas.

The values are accurate for portuguese reality, but dispite that, it should be used at your own responsability. Please `check it first with your pediatric or family nurse`.

## Features

- You input the children's weigth and select one of the syrup options
- Then the dosage is displayed in mililiters and miligrams
- Above 50kg you will get an error, because syrup is no longer the better option.

## Getting Started

### Installation

Install the dependencies:

```bash
npm install
```

### Development

Start the development server with HMR:

```bash
npm run dev
```

Your application will be available at `http://localhost:5173`.

## Building for Production

Create a production build:

```bash
npm run build
```

## Deployment

### Docker Deployment

To build and run using Docker:

```bash
docker build -t my-app .

# Run the container
docker run -p 3000:3000 my-app
```
