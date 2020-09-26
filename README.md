<img src="./src/images/wole-joko-logo.png" />

A fun little app that mimics admitting people into an event hall and getting them well seated!

[![Codacy Badge](https://app.codacy.com/project/badge/Grade/491cac0edb794c37a66f978a8a3cd45f)](https://www.codacy.com/manual/chalu/wole-joko/dashboard?utm_source=github.com&amp;utm_medium=referral&amp;utm_content=chalu/wole-joko&amp;utm_campaign=Badge_Grade) [![Netlify Status](https://api.netlify.com/api/v1/badges/1cd7dbc7-4c42-448b-a1bc-5125142a7686/deploy-status)](https://app.netlify.com/sites/wole-joko/deploys)

---

This mini-app was created as a personal challenge to build a functional "version" of what I was asked to code (live) during an engineering manager interview. The specs were as follows: 

*   A random number of people will show up for the event on a given day

*   The (church) hall has a max capacity of **8000** seats in **500** rows. Each row has **16** seats and there are **250** rows on either side of the hall. The inner ends of the rows are filled first. At full capacity, stop admitting people into the hall

*   Only a batch of 16 people can enter the hall at a time. A new batch is admitted only after the previous batch is seated

*   When a given batch is in the hall, people are ushered into seats in the 2 sides of the hall concurrently

*   To make it more life-like and to pevent rush, the app should simulate a random delay for everyone getting seated, and the ushers directing them to their seats

> **This Is Still Work In Progress**

## TODOs

*   Expose UI controls to allow users configure the specs e.g the seating capacity, seats per row, e.t.c

*   Apart from looking at console logs, allow users opt-in to see status messages of what the app is currently doing, from the UI
