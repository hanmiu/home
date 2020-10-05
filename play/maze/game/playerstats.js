export class PlayerStats {
  constructor(callback) {
    this.current_username = username;
	this.stats = [];

    /*
	if (this.current_username !== null) {
      // load from server if user is logged in
      let this_ = this;
      $.ajax({
        'url': '/stats/',
        'type': 'GET',
        'cache': false,
        'dataType': 'json',
        'success': function(stats) {
          this_.stats = stats;
          callback();
        }
      });
	} else {
      // load from cookie if user isn't logged in
      this.stats = JSON.parse(getCookie('rapt') || '[]');
      callback();
	}
    */
    callback();
  }
  
  getStatsForLevel(username, levelname) {
	// try looking up stat by username and levelname
	for (let i = 0; i < this.stats.length; i++) {
      let stat = this.stats[i];
      if (stat['username'] == username && stat['levelname'] == levelname) {
        return stat;
      }
	}

	// return default if not found
	return {
      'username': username,
      'levelname': levelname,
      'complete': false,
      'gotAllCogs': false
	}
  }

  setStatsForLevel(username, levelname, complete, gotAllCogs) {
	// remove all existing stats for this level
	for (let i = 0; i < this.stats.length; i++) {
      let stat = this.stats[i];
      if (stat['username'] == username && stat['levelname'] == levelname) {
        this.stats.splice(i--, 1);
      }
	}

	// insert new stat
	let stat = {
      'username': username,
      'levelname': levelname,
      'complete': complete,
      'gotAllCogs': gotAllCogs
	};
	this.stats.push(stat);

	if (this.current_username !== null) {
      // save stat to server if user is logged in
      /*
      $.ajax({
        'url': '/stats/',
        'type': 'PUT',
        'dataType': 'json',
        'data': JSON.stringify(stat),
        'beforeSend': function(xhr) {
          xhr.setRequestHeader('X-CSRF-Token', $('meta[name="csrf-token"]').attr('content'));
        },
        'contentType': 'application/json; charset=utf-8'
      });
      */
      console.log('save stat');
    } 
    else {
      // save stat to cookie if user isn't logged in
      setCookie('rapt', JSON.stringify(this.stats), 365 * 5);
	}
  }
}