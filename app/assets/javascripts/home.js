$(document).ready(function() {

  Vue.component('game-sidebar', {
    template:
      `<div class="col-sm-4">
        <div class="sidebar list-group">
          <div class="sidebar-header">
            Map
          </div>
          <div class="sidebar-body">
            <div class="sidebar-box">
              PUT THE MAP IN HERE YO
            </div>
          </div>
        </div>
      </div>`
  });

  Vue.component('top-event', {
    props: ["game_id", "name", "attendee_count"],
    template:
      `<div class="sidebar-box clickable" v-on:click="viewGame">
        {{name}}
        <br/>
        <span class="alt-text" v-if="attendee_count === 1">{{attendee_count}} person going</span>
        <span class="alt-text" v-else>{{attendee_count}} people going</span>
      </div>`,
    methods: {
      viewGame: function(event) {
        if (home.view != 'game-info') {
          home.view = 'game-info';

          // Hide the scroll for the body
          $('body').css('overflow', 'hidden');

          var target = event.currentTarget;
          $(target).addClass('game-click');
          setTimeout(function() {
            $(target).removeClass('game-click');
          }, 400);

          $.ajax({
            url: `/games/${this.game_id}`,
            success: function(res) {
              home.game_info = {
                datetime: res.datetime,
                sport: res.sport.name,
                team1: res.team1.name,
                team2: res.team2.name,
                events: res.events
              };
            }
          });
        }
      }
    }
  });

  Vue.component('main-sidebar', {
    props: ["top_events"],
    template:
      `<div class="col-sm-4">
        <div class="sidebar list-group">
          <div class="sidebar-header">
            Popular Events
          </div>
          <div class="sidebar-body">
            <top-event v-for="event in top_events"
              :game_id="event.game_id"
              :name="event.name"
              :attendee_count="event.attendee_count">
            </top-event>
          </div>
        </div>
      </div>`
  });

  Vue.component('nav-bar', {
    props: ["user_id", "user_name"],
    template:
    `<nav class="navbar navbar-default navbar-fixed-top">
        <div class="navbar-header">
          <a class="navbar-brand" href="/"><object class="svg-logo" type="image/svg+xml" data="/assets/sportsello.svg"></object></a>
        </div>

          <div class="navbar-collapse collapse">
            <ul class="nav navbar-nav">
            </ul>
            <div class="row" style="margin-right:60px">
              <log-reg-btn
                :user_id="user_id"
                :user_name="user_name"
              >
              </log-reg-btn>
            </div>
          </div>
        </div> <!-- End of #navbar -->
    </nav>`
  });

Vue.component('log-reg-btn', {
  props: ['user_id', 'user_name'],
  template:
  `
  <span class="nav navbar-nav navbar-right">
    <div v-if="user_name" class="row" style="margin-right:60px">
      <strong v-text="user_name"></strong>
      | <a class="clickable" id='sign_out' v-on:click="signOut"> SIGN OUT </a>
    </div>
    <div v-else>
      <a class="log-in clickable" v-on:click="showLogin">SIGN IN</a> |
      <a class="register clickable" v-on:click="showReg">REGISTER</a>
    </div>
  </span>
  `,
  methods: {
    showLogin: function () {
      home.view = 'login'
    },
    showReg: function () {
      home.view = 'register'
    },
    signOut: function () {
      var self = this;
      $.ajax({
        url: '/signout',
        method:'GET',
        success: function (res) {
          home.user_id = null;
          home.user_name = null;
          self.user_id = null;
          self.user_name = null;
          window.sessionStorage.user_id = null;
          window.sessionStorage.user_name = null;
        }
      });
      home.view = 'empty'
    }
  }
})

  Vue.component('search-bar', {
    template:
      `<div class="input search-bar-container">
        <input type="text" class="form-control search-bar" placeholder="What are you looking for?">
        <span class="glyphicon glyphicon-search btn-search clickable" aria-hidden="true"></span>
      </div>`
  });

  Vue.component('vue-panel', {
    template:
      `<div class="close-panel clickable" v-on:click="closePanel">
        &times;
      </div>`,
    methods: {
      closePanel: function() {
        home.view = 'empty';
        // Enable the scroll for the body
        $('body').css('overflow', 'scroll');
      }
    }
  });

  var gameInfo = {
    props: ['game_info'],
    template:
      `<div class="vue-panel">
        <vue-panel/>
        <div class="app-container">
          <div class="row">
            <div class="col-sm-8">
              <div class="content">
                <div class="game-info">
                  <game-box
                    :datetime="game_info.datetime"
                    :sport="game_info.sport"
                    :team1="game_info.team1"
                    :team2="game_info.team2">
                  </game-box>
                  <div class="section-header">EVENTS</div>
                  <event-box
                    v-if="game_info.events"
                    v-for="event in game_info.events"
                    :id="event.id"
                    :name="event.name"
                    :venue="event.venue"
                    :attendees="event.attendees">
                  </event-box>
                  <div class="box" v-if="!game_info.events.length">
                    Unfortunately there are no events for this game. Are you hosting one?
                  </div>
                </div>
              </div>
            </div>

            <game-sidebar>
            <game-sidebar/>
          </div>
        </div>
      </div>`
  };

  Vue.component('event-box', {
    props: ['id', 'name', 'venue', 'attendees'],
    data: function() {
      return {
        attendeesList: this.attendees,
        attendeesCount: this.attendees.length,
        isAttending: false
      }
    },
    created: function() {
      // If user is attending, set attending to true
      if (this.attendeesList.indexOf(+window.sessionStorage.getItem('user_id')) !== -1) {
        this.isAttending = true;
      }
    },
    template:
      `<div class="event">
        <div class="attendee-col col-sm-3">
          <button class="btn btn-primary" v-on:click="cancel" v-if="isAttending">Cancel RSVP</button>
          <button class="btn btn-primary" v-on:click="attending" v-else>I'm attending!</button>

          <p class="alt-text" v-if="attendeesCount === 1">{{attendeesCount}} person attending</p>
          <p class="alt-text" v-else>{{attendeesCount}} people attending</p>
        </div>
        <div class="info-container col-sm-9">
          <p class="alt-text" v-text="venue.description"></p>
          <div class="center">
            <div class="event-name col-sm-3" v-text="name"></div>
            <div class="at col-sm-3">@</div>
            <div class="venue-name col-sm-3" v-text="venue.name"></div>
          </div>
        </div>
      </div>`,
    methods: {
      attending: function() {
        const that = this;
        const userID = window.sessionStorage.getItem('user_id');
        $.ajax({
          url: `/events/${this.id}/attending/${userID}`,
          method: 'POST',
          success: function(res) {
            that.isAttending = true;
            that.attendeesList.push(userID);
            that.attendeesCount = that.attendeesList.length;
          }
        });
      },
      cancel: function () {
        const that = this;
        const userID = window.sessionStorage.getItem('user_id');

        $.ajax({
          url: `/events/${this.id}/cancel_rsvp/${userID}`,
          method: 'POST',
          success: function(res) {
            that.isAttending = false;
            var userFound = that.attendeesList.indexOf(userID);
            that.attendeesList.splice(userFound);
            that.attendeesCount = that.attendeesList.length;
          }
        });
      }
    }
  });

  Vue.component('game-box', {
    props: ['id', 'datetime', 'sport', 'team1', 'team2'],
    data: function() {
      return {
        displayDate: false,
        displayTime: true,
        displayDateTime: false,
        date: this.datetime,
        time: this.datetime,
      }
    },
    beforeMount: function() {
      var datetime = moment(this.datetime);
      var date = datetime.format('dddd, MMMM Do YYYY');
      var time = datetime.format('h:mm a');

      this.date = date;
      this.time = time;

      if (home.view === 'game-info') {
        this.displayDateTime = true;
        this.displayTime = false;
      } else if (home.lastDate != date) {
        home.lastDate = date;
        this.displayDate = true;
      }
    },
    template:
      `<div>
        <div class="section-header" v-if="displayDate" v-text="date"></div>
        <div class="section-header" v-if="displayDateTime">{{date}} @ {{time}}</div>
        <div class="game" v-on:click="viewGame">
          <div class="time-container col-sm-3">
            <p class="time alt-text" v-text="time" v-if="displayTime"></p>
            <button class="btn btn-primary">I'm hosting!</button>
          </div>
          <div class="info-container col-sm-9">
            <p class="sport alt-text" v-text="sport"></p>
            <div class="center">
              <div class="team1 col-sm-3" v-text="team1"></div>
              <div class="vs col-sm-3">VS</div>
              <div class="team2 col-sm-3" v-text="team2"></div>
           </div>
          </div>
        </div>
      </div>`,
    methods: {
      viewGame: function(event) {
        if (home.view != 'game-info') {
          home.view = 'game-info';

          // Hide the scroll for the body
          $('body').css('overflow', 'hidden');

          var target = event.currentTarget;
          $(target).addClass('game-click');
          setTimeout(function() {
            $(target).removeClass('game-click');
          }, 400);

          $.ajax({
            url: `/games/${this.id}`,
            success: function(res) {
              home.game_info = {
                datetime: res.datetime,
                sport: res.sport.name,
                team1: res.team1.name,
                team2: res.team2.name,
                events: res.events
              };
            }
          });
        }
      }
    },
  });

  $('.log-in').click(function() {
    home.view = 'login';
    // Hide the scroll for the body
    $('body').css('overflow', 'hidden');
  });

  $('.register').click(function() {
    home.view = 'register';
    // Hide the scroll for the body
    $('body').css('overflow', 'hidden');
  });

  Vue.component('login-form', {
    template:
      `<div class="login-form">
        <form v-on:submit.prevent='loginFn'>
          <div class="form-group">
            <label for="email">Email</label>
            <input
              type="email"
              class="form-control"
              id="email"
              name="email"
              placeholder="example@sportsello.com"
              v-model="email"
            >
          </div>
          <div class="form-group">
            <label for="password">Password</label>
            <input
              type="password"
              class="form-control"
              id="password"
              name="password"
              placeholder="Password"
              v-model="password"
            >
          </div>
          <button class="btn btn-primary pull-right">Log in</button>
        </form>
      </div>`,
      methods: {
      loginFn: function () {
        var self = this;
        $.ajax({
          url: '/login',
          method: 'POST',
          data: { email: self.email, password: self.password },
          success: function (data) {
            home.user_id = data.id;
            home.user_name = data.name;
            window.sessionStorage.setItem( 'user_id', data.id );
            window.sessionStorage.setItem( 'user_name', data.name );
            home.view = 'empty'
          }
        });
      }
    }
  }
);

  Vue.component('facebook-button', {
    template:
      `<button class="btn btn-block btn-social btn-facebook"
        onclick="window.location.href='/auth/facebook'">
        <span class="fa fa-facebook"></span>
        Log in with Facebook
      </button>`
  });

  Vue.component('register-form', {
    template:
      `<div class="login-form">
        <form v-on:submit.prevent='registerFn'>

          <div class="form-group">
            <label for="name">Name</label>
            <input
              v-model="name"
              type="name"
              class="form-control"
              id="name"
              name="name"
              placeholder="Wayne Gretzky"
            >
          </div>

          <div class="form-group">
            <label for="email">Email</label>
            <input
            v-model="email"
              type="email"
              class="form-control"
              id="email"
              name="email"
              placeholder="example@sportsello.com"
            >
          </div>

          <div class="form-group">
            <label for="password">Password</label>
            <input
              v-model="password"
              type="password"
              class="form-control"
              id="password"
              name="password"
              placeholder="Password"
            >
          </div>

          <div class="form-group">
            <label for="password_confirmation">Password Confirmation</label>
            <input
              v-model="password_confirmation"
              type="password"
              class="form-control"
              id="password_confirmation"
              name="password_confirmation"
              placeholder="Password Confirmation"
            >
          </div>

          <button type="submit" class="btn btn-primary pull-right">Register</button>
        </form>

      </div>`,
      methods: {
        registerFn: function () {
          var self = this;
          $.ajax({
            url: '/users',
            method: 'POST',
            data: {
              name:                  self.name,
              email:                 self.email,
              password:              self.password,
              password_confirmation: self.password_confirmation
            },
            success: function (data) {
              // If any errors, the type of that field will be Object
              if (typeof(data.name) !== 'string'
              && typeof(data.email) !== 'string'
              && typeof(data.password) !== 'string'
              && typeof(data.password_confirmation) !== 'string'
            ) {
              // Error logic goes here
              } else {
                home.user_id = data.id;
                home.user_name = data.name;
                window.sessionStorage.setItem( 'user_id', data.id );
                window.sessionStorage.setItem( 'user_name', data.name );
                home.view = 'empty'
              }
            }
          });
          }
        }
      })

  var login = {
    template:
      `<div class="vue-panel">
        <vue-panel/>
        <div class="app-container">
          <div class="content">
            <div class="login box">
              <facebook-button/>
              <div class="center special-text">OR</div>
              <login-form/>
            </div>
          </div>
        </div>
      </div>`
  };

  var register = {
    template:
      `<div class="vue-panel">
        <vue-panel/>
        <div class="app-container">
          <div class="content">
            <div class="login box">
              <facebook-button/>
              <div class="center special-text">OR</div>
              <register-form/>
            </div>
          </div>
        </div>
      </div>`
  }

  var empty = {
    template: '<div></div>'
  };


  var home = new Vue({
    el: '#home',
    components: {
      'empty': empty,
      'game-info': gameInfo,
      'login': login,
      'register': register
    },
    data: {
      view: 'empty',
      games_list: [],
      game_info: {},
      top_events: [],
      last_date: '',
      session: {},
      user_id: null,
      user_name: null
    },
    created: function() {
      this.scroll();
      this.getTopEvents();
      this.getGames();
      this.updateUser();
    },
    updated: function() {
      $('.bottom-loader').hide();
      $('.loader').fadeTo("slow", 0, function() {
        $('.loader').hide();
      });
    },
    methods: {
      scroll: function() {
        var that = this;
        window.addEventListener('scroll', function () {
          // Show scroll to top icon
          if ($(window).scrollTop() > $(window).height()) {
            $('.scroll-to-top').css('opacity', '100');
          } else {
            $('.scroll-to-top').css('opacity', '0');
          }

          // Load more games
          if ($(window).scrollTop() + $(window).height() == $(document).height()) {
            that.getGames();
          }
        })
      },
      getGames: function() {
        $('.bottom-loader').show();
        const that = this;
        const lastDateTimeString = getLastDateTime(this.games_list)

        $.ajax({
          url: `/games.json?game_datetime=${lastDateTimeString}`,
          success: function(res) {
            res.games.forEach(function(game) {
              that.games_list.push(game);
            });
            $('.bottom-loader').hide();
          }
        });
      },
      updateUser: function () {
        var self = this
        if ($('#user-id')) {
          self.user_id = $('#user-id').text().replace(/^\s+|\s+$/g, '');
          self.user_name = $('#user-name').text().replace(/^\s+|\s+$/g, '');
          window.sessionStorage.setItem( 'user_id', self.user_id );
          window.sessionStorage.setItem( 'user_name', self.user_name );
        }
        this.user_id = window.sessionStorage.user_id;
        this.user_name = window.sessionStorage.user_name;
      },
      getTopEvents: function() {
        const that = this;
        $.ajax({
          url: `/events/top`,
          success: function(res) {
            that.top_events = res;
          }
        });
      }
    }
  });

  function getDateTime() {
    var today = new Date();
    var yr = today.getFullYear();
    var month = today.getMonth() + 1;
    var day = today.getDate();
    return yr + '-' + month + '-' + day + ' 00:00:00';
  }

  function getLastDateTime(games_array) {
    if (games_array.length === 0) {
      return getDateTime();
    } else {
      return games_array[games_array.length - 1].datetime;
    }
  }


});
