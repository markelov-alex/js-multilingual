# Multilingual

This application was created just for fun and to train Vue.js+vuex skills. 

Multilingual intended for reading multiple synchronized texts side by side. You can create your own project, load and parse few editions of some text, and read them privately or publish for everyone. This could be very useful for language learners or for those who need to compare different editions or translations of some novel or play. 

I know some people who investigate the works of Shakespeare, Kipling, Maugham, and Homer and who can not avoid appealing to original texts because they realize how translators could transform the true meaning into something complete different. For this cases, it is known a proverb: "Translator is a weapon of the devil". For those who wants to read the world's literature treasures from their originals this is the tool.

The application is very simple. First you create or open a project, for example, '"Hamlet" by William Shakespeare'. This project may contain few English texts from different folios and few translations on the language you speak. 

If you are the owner or granted with the rights, you may edit projects and documents. Otherwise, you should duplicate one and then edit. For example, if you want to make some notes opposite paragraphs, you should duplicate project and create new empty document editing its paragraphs.

## Run

```bash
npm install
# Run json-server to save all results to static/mocks/api/db.json
npm run mockapi
# Build project and run localhost server
npm run start
```

## Configuration

You can configure application for dev and prod modes in src/config.js:
- `apiBaseURL` - URL to back-end
- `useJsonServerMockApi` - set to true if you use json-server as back-end
- `localSaveEnabled` - all results will be saved to browser's local storage and will be loaded on next start. That prevents losing of data on server disconnect if you forget to export your project or document. Save triggered on each vuex mutation and debounced by 1 second. The whole vuex state is saving to local storage.

## Structure

Application has layered structure accumulating all responsibilities in separate places, so any co-worker can easily access his responsibility area without seeking all needed parts through-out the whole application. Also this reduces the risks to damage something.
Here are such areas described:

- **for designers:**
  - `src/assets` - to change styles and images
  - `src/components` - to change markup and layout (HTML)
  
- **for back-end developers:**
  - `src/store/api` - to change URLs and methods to access the server.
  The scheme used is like here: http://www.restapitutorial.com/lessons/httpmethods.html
  For now, 'json-server' is used as back-end. The results saving into static/mocks/api/db.json

- **for front-end developers:**
  - `src/store` - to change model and business logic
  - `src/components` - to change components' look and feel
  
- **for all developers:**
  - `src/router` - to change application's external URLs

## Client-Server synchronization

### Debouncing

All changes are made through vuex's actions. In those actions we can decide how to synchronize changes with server, considering also offline mode:
1) save any change immediately (DDoS our server);
2) throttle queries (group same queries inside fixed time interval)
3) debounce queries (send request only if there is no repeating query during time interval)
(See https://css-tricks.com/debouncing-throttling-explained-examples/)

Here 1) is the worst and 3) is the best. When we typing new project name we won't send the name with each new letter just added, but only the final version. All queries to back-end are debounced by 2 seconds.

### Sync modes

For experimenting, there are two radio buttons in app's GUI: 'Web mode' and 'Desktop mode'. You can switch between them to change synchronization mode with web server. In web mode, you can create/delete any item (project or document) only after request to web server succeeded. So if server is unavailable you cannot do create or delete anything. In desktop mode, you can create/delete anything immediately but send to server debouncing by 2 seconds. But other updates processed pretty similar for both modes to debounce them not DDoSing the server.

### On sync fails

It is important that if request to web server fails there will be saved in local storage not only the resulting state but also all the changes made since the last successful sync. So you can send you changes to web next time it's available.

Email: alex.panoptik [at] gmail.com
