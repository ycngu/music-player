onceLrc = []
parseLyric = function(text) {
        //get each line from the text
        var lines = text.split('\n')
            //this regex mathes the time [00.12.78]
        var pattern = /\[\d{2}:\d{2}.\d{2}\]/g
        var result = []

        // Get offset from lyrics
        var offset = getOffset(text)

        //exclude the description parts or empty parts of the lyric
        while (!pattern.test(lines[0])) {
            lines = lines.slice(1)
        }
        //remove the last empty item
        lines[lines.length - 1].length === 0 && lines.pop()
        //display all content on the page
        lines.forEach(function(v, i, a) {
            var time = v.match(pattern)
            var value = v.replace(pattern, '')
            time.forEach(function(v1, i1, a1) {
                //convert the [min:sec] to secs format then store into result
                var t = v1.slice(1, -1).split(':')
                result.push([parseInt(t[0], 10) * 60 + parseFloat(t[1]) + parseInt(offset) / 1000, value]);
            })
        })
        //sort the result by time
        result.sort(function(a, b) {
            return a[0] - b[0]
        })
        return result
}

getLyric = function(url) {
        var that = this
        var request = new XMLHttpRequest()
        request.open('GET', url, true)
        request.responseType = 'text'
        //fix for the messy code problem for Chinese.  
        // reference: http://xx.time8.org/php/20101218/ajax-xmlhttprequest.html
        //request['overrideMimeType'] && request.overrideMimeType("text/html;charset=gb2312");
        request.onload = function() {
            that.lyric = that.parseLyric(request.response)
            onceLrc = that.lyric
            //display lyric to the page
            that.appendLyric(that.lyric)
        };
        request.onerror = request.onabort = function(e) {
            that.lyricContainer.textContent = '!failed to load the lyric :('
        }
        this.lyricContainer.textContent = 'loading lyric...'
        request.send()
}

appendLyric = function(lyric) {
        var that = this
        var lyricContainer = this.lyricContainer
        var fragment = document.createDocumentFragment()
        //先清除原先的HTML
        this.lyricContainer.innerHTML = ''
        lyric.forEach(function(v, i, a) {
            var line = document.createElement('p')
            line.id = 'line-' + i
            line.textContent = v[1]
            fragment.appendChild(line)
        })
        lyricContainer.appendChild(fragment)
}

getOffset = function(text) {
        //Returns offset in miliseconds.
        var offset = 0;
        try {
            // Pattern matches [offset:1000]
            var offsetPattern = /\[offset:\-?\+?\d+\]/g
                // Get only the first match.
            var offset_line = text.match(offsetPattern)[0]
                // Get the second part of the offset.
            var offset_str = offset_line.split(':')[1]
            // Convert it to Int.
            offset = parseInt(offset_str);
        } catch (err) {
            //alert("offset error: "+err.message);
            offset = 0
        }
        return offset
}

// player.addEventListener("timeupdate", function(e) {
//         // if (!that.lyric) return;
//         for (var i = 0, l = lyric.length; i < l; i++) {
//             if (player.currentTime > lyric[i][0] - 0.50 /*preload the lyric by 0.50s*/ ) {
//                         //single line display mode
//                         // that.lyricContainer.textContent = that.lyric[i][1];
//                         //scroll mode
//             var line = document.getElementById('line-' + i)
//             var prevLine = document.getElementById('line-' + (i > 0 ? i - 1 : i))
//             prevLine.className = '';
//                         //randomize the color of the current line of the lyric
//             line.className = 'current-line-' + that.lyricStyle;
//             that.lyricContainer.style.top = 130 - line.offsetTop + 'px';
//         }
//     }
// })


