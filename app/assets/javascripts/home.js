$(document).ready(function() {

  Vue.component('vue-panel', {
    template:
      `<div class="close-panel" v-on:click="closePanel">
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
        <div class="game-info">
          <game-box
            :datetime="game_info.datetime"
            :sport="game_info.sport"
            :team1="game_info.team1"
            :team2="game_info.team2">
          </game-box>
        </div>
      </div>
    </div>`
  };

  Vue.component('game-box', {
    props: ['id', 'datetime', 'sport', 'team1', 'team2'],
    template:
      `<div class="game" v-on:click="viewGame">
        <div class="time-container col-sm-3">
          <p class="time alt-text" v-text="datetime"></p>
        </div>
        <div class="info-container col-sm-9">
          <p class="sport alt-text" v-text="sport"></p>
          <div class="team1 col-sm-3" v-text="team1"></div>
          <div class="vs col-sm-3">VS</div>
          <div class="team2 col-sm-3" v-text="team2"></div>
        </div>
      </div>`,
    methods: {
      viewGame: function(event) {
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
              team2: res.team2.name
            };
          }
        });
      }
    },
  });

  var empty = {
    template: '<div></div>'
  }

  var home = new Vue({
    el: '#home',
    components: {
      'empty': empty,
      'game-info': gameInfo
    },
    data: {
      view: 'empty',
      games_list: [],
      game_info: {}
    },
    created: function() {
      this.scroll();
      this.getGames();
    },
    methods: {
      scroll: function() {
        var that = this;
        window.addEventListener('scroll', function () {
          if($(window).scrollTop() + $(window).height() == $(document).height()) {
            that.getGames();
          }
        })
      },
      getGames: function() {
        var that = this;
        var lastDateTimeString = getLastDateTime(this.games_list)

        $.ajax({
          url: `/games.json?game_datetime=${lastDateTimeString}`,
          success: function(res) {
            res.games.forEach(function(game) {
              that.games_list.push(game);
            });
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