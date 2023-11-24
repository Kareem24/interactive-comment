# Interactive comments section

This is a solution to the [Interactive comments section challenge on Frontend Mentor](https://www.frontendmentor.io/challenges/interactive-comments-section-iG1RugEG9). Frontend Mentor challenges help you improve your coding skills by building realistic projects.

- [Overview](#overview)
  - [The challenge](#the-challenge)
  - [Screenshot](#screenshot)
  - [Links](#links)
- [My process](#my-process)
  - [Built with](#built-with)
  - [What I learned](#what-i-learned)
  - [Continued development](#continued-development)
  - [Useful resources](#useful-resources)
- [Author](#author)
- [Acknowledgments](#acknowledgments)

## Overview

The interactive comment section allow user to post, edit, delete, reply, up-vote and down-vote a comment .This project uses HTML , CSS and JavaScript to create the layout, style and functionality of the comments sections. It also uses a LocalStorage web API to store and retrieve data.

### The challenge

Users should be able to:

- View the optimal layout for the app depending on their device's screen size
- See hover states for all interactive elements on the page
- Create, Read, Update, and Delete comments and replies
- Upvote and downvote comments
- **Bonus**: If you're building a purely front-end project, use `localStorage` to save the current state in the browser that persists when the browser is refreshed.
- **Bonus**: Instead of using the `createdAt` strings from the `data.json` file, try using timestamps and dynamically track the time since the comment or reply was posted.

### Screenshot

![](./design/desktop-design.jpg)

### Links

- [Source code](https://github.com/kareem24/interactive-comment)
- [Live preview](https://interactive-comments-sections-r.netlify.app)

### Built with

- Semantic HTML5 markup
- CSS custom properties
- Flexbox
- CSS Grid

### What I learned

Learn how to use grid-row and grid-column for responsiveness.
and how to fetch data dynamically without complicating the `async function` call

```css
.headings {
  grid-row: 1/2;
  grid-column: 1/3;
}

.comment {
  grid-column: 1/3;
  grid-row: 2/3;
}
```

```js
const fetchData = async function () {
  try {
    let data;
    if (localStorage.getItem("data")) {
      data = getFromStorage();
    } else {
      const response = await fetch("../data.json");
      data = await response.json();
      setToStorage(data);
    }

    loadPage(data);
  } catch (err) {
    // eslint-disable-next-line no-console
    console.error(err);
  }
};
```

### Useful resources

- [Learn how to use Grid lines](https://youtu.be/J5GWyiWU2H8?si=hbp09X2c7h2sLrHS) - This helped me understand better how grid works and to use it for layout structure for responsiveness.

## Author

- Website - [Kareem Roqib](https://github.com/kareem24)
- Frontend Mentor - [@kareem24](https://www.frontendmentor.io/profile/kareem24)
- Twitter - [@Kareem Ricky](https://www.twitter.com/adekunle1855)

### Development (Running locally)

- Clone the project

```bash
git clone https://github.com/meet-Ups/html-css-js-template.git

```

- Install Dependencies

```bash
npm install
```

To run StyleLint by itself, you may run the lint task:

```bash
npm run lint:check
```

Or to automatically fix issues found (where possible):

```bash
npm run lint
```

You can also check against Prettier:

```bash
npm run format:check
```

and to have it actually fix (to the best of its ability) any format issues, run:

```bash
npm run format
```

## 🤝 Contributing

Contributions, issues and feature requests are welcome!

Feel free to check the [issues page](../../issues).

## Show your support

Give a ⭐️ if you like this project!

## Acknowledgments

- Hat tip to anyone whose code was used
- Inspiration, resources/assets used
- etc

```

```
