## Reflection Vibe-code opgave

The task was more difficult than I thought.
At first, everything started very well since the copilot gave me a website with the style and layout ready, along with the router.

However, when trying to add functionality to the pages, the copilot started failing in multiple ways and I had many open errors in the browser. Including an infinite loop due to misuse of the UseEffect hook, which caused my computer to crash.

For example this error was causing more than 3000 erros in my terminal and I'm not really sure why.
eror 💥👾
```js
useEffect(() => {
  setFavs(getFavs())
}, [user])

```
solution 
```js
const [favs, setFavs] = useState(() => getFavs());
```

Trying to troubleshoot the code provided by the copilot was very difficult because much of the code was not written with tools I've used before, and fixing something you don't understand can be a big challenge.

Was also frustraiting to just wait and see that the copilot would do.
My copilot suddenly stopped working and only showed me errors and asked me to try again, only freezing at the end.