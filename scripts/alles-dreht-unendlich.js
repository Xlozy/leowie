
      const sentence = ["dreht", "sich", "doch", "alles", "um", "mich"]

      const outputCanvas = document.getElementById("content")
      const wrapper = document.getElementById("wrapper")
      wrapper.addEventListener('scroll', userScrolled)

      const printing = setInterval(printNewShuffle, 1900)

      let isFirstLine = true
      function printNewShuffle() {
        if (!isFirstLine) {shuffle(sentence)}

        printToScreen(sentence);

        if (isFirstLine) {isFirstLine = false}
      }

      function shuffle(array) {
        var m = array.length, t, i;

        // While there remain elements to shuffle…
        while (m) {

          // Pick a remaining element…
          i = Math.floor(Math.random() * m--);

          // And swap it with the current element.
          t = array[m];
          array[m] = array[i];
          array[i] = t;
        }

        return array;
      }

      function printToScreen (x) {
        x = x.join(' ')

        outputCanvas.innerHTML = outputCanvas.innerHTML + `<p>${x}</p>`

        updateScroll()
      }

      let stickToBottom = false;
      function updateScroll() {
          if(stickToBottom){
              wrapper.scrollTop = wrapper.scrollHeight;
          }
      }
      function userScrolled() {
        const o = wrapper
        let pos = (o.scrollTop || document.body.scrollTop) + o.offsetHeight;
        let max = o.scrollHeight;

        stickToBottom = (isAround(pos, max, 20)) ? true:false
      }

      function isAround(x, y, tolerance) {
        return x >= (y - tolerance) && x <= (y + tolerance);
      }