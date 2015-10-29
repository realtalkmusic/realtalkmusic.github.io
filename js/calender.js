// <!-- calenders -->

 // Your Client ID can be retrieved from your project in the Google
      // Developer Console, https://console.developers.google.com
      var CLIENT_ID = '799273275391-l1srb04kqr0m6vvh7h4o8tvaancd09jl.apps.googleusercontent.com';

      var SCOPES = ["https://www.googleapis.com/auth/calendar.readonly"];

      /**
       * Check if current user has authorized this application.
       */
      function checkAuth() {
        gapi.auth.authorize(
          {
            'client_id': CLIENT_ID,
            'scope': SCOPES.join(' '),
            'immediate': true
          }, handleAuthResult);
      }

      /**
       * Handle response from authorization server.
       *
       * @param {Object} authResult Authorization result.
       */
      function handleAuthResult(authResult) {
        var authorizeDiv = document.getElementById('authorize-div');
        if (authResult && !authResult.error) {
          // Hide auth UI, then load client library.
          authorizeDiv.style.display = 'none';
          loadCalendarApi();
        } else {
          // Show auth UI, allowing the user to initiate authorization by
          // clicking authorize button.
          authorizeDiv.style.display = 'inline';
        }
      }

      /**
       * Initiate auth flow in response to user clicking authorize button.
       *
       * @param {Event} event Button click event.
       */
      function handleAuthClick(event) {
        gapi.auth.authorize(
          {client_id: CLIENT_ID, scope: SCOPES, immediate: false},
          handleAuthResult);
        return false;
      }

      /**
       * Load Google Calendar client library. List upcoming events
       * once client library is loaded.
       */
      function loadCalendarApi() {
        gapi.client.load('calendar', 'v3', listUpcomingEvents);
      }

      /**
       * Print the summary and start datetime/date of the next ten events in
       * the authorized user's calendar. If no events are found an
       * appropriate message is printed.
       */
      function listUpcomingEvents() {
        var request = gapi.client.calendar.events.list({
          'calendarId': 'primary',
          'timeMin': (new Date()).toISOString(),
          'showDeleted': false,
          'singleEvents': true,
          'maxResults': 10,
          'orderBy': 'startTime'
        });

        request.execute(function(resp) {
          var events = resp.items;
          // appendPre('Upcoming events:');
          
          if (events.length > 0) {
            for (i = 0; i < 5; i++) {
              var event = events[i];        //individual object
              var link = event.description;    //extract object description (link to venue/tickets page)

              appendDateTime(event.start.dateTime, event.end.dateTime, i+1)
              appendLink(link, i+1);
              appendLocation(event.summary, i+1)

            }
          } else {
            appendLocation('No upcoming events', i+1);
          }

        });
      }

      //send link to venue/tickets page to '<a>' tag
      function appendLink(message, count) {
        var aTag = document.getElementById('link-'+count);
        aTag.setAttribute("href", "https://" + message);
      }
      /**
       * Append date and time to appropriate places in website
       * 
       *
       * @param {date} start_time - timestamp of starting time.
       * @param {date} end_time - timestamp of ending time.
       */
      function appendDateTime(start_time, end_time, count) {

        //start + end time
        var hours_minutes_array_start = []
        var hours_minutes_array_end = []

        var begin = new Date(start_time)
        var finish = new Date(end_time)

        hours_minutes_array_start[0] = begin.getHours()
        hours_minutes_array_start[1] = ("0" + begin.getMinutes()).slice(-2)

        hours_minutes_array_end[0] = finish.getHours()
        hours_minutes_array_end[1] = ("0" + finish.getMinutes()).slice(-2)

        var time_message = hours_minutes_array_start[0] + ":" + hours_minutes_array_start[1] + " - " + hours_minutes_array_end[0] + ":" + hours_minutes_array_end[1]

        if(!time_message)
        {
          return
        }
        else
        {
          document.getElementById('time-'+count).innerHTML = time_message;
        }

        // date
        var month, day, year, date_message

        month = begin.getMonth() + 1
        day = begin.getDate()
        year = begin.getFullYear()

        date_message =  month + '/' + day + '/' + year
        document.getElementById('date-'+count).innerHTML = date_message;

      }

      //send venue name to html
      function appendLocation(message, count) {
        var paragraph = document.getElementById('location-'+count);
        var textContent = document.createTextNode(message + '\n');
        paragraph.appendChild(textContent);
      }
