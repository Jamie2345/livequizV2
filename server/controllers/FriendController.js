const questionSchema = require('../models/Question');
const User = require('../models/User');


const request = (req, res, next) => {
  
  const { userToRequest } = req.body;

  User.findById(req.userInfo.id)
  .then(currentUser => {
    // if user not found
    if (!currentUser) {
      res.status(404).json({ message: 'Invalid user ID' });
      return;
    }

    // if already friends with this user
    if (currentUser.friends.some(friend => friend.userId === userToRequest)) {
      res.status(409).json({ message: 'This user is already your friend' });
      return;
    }

    // check if user is already requesting
    if (currentUser.pendingFriends.outgoing.some(pending => pending.userId === userToRequest)) {
      res.status(409).json({ message: 'You have already sent this user a friend request'});
      return;
    }

    // find the user to follow
    // find the user to follow
    User.findById(userToRequest)
    .then(userFound => {
      if (!userFound) {
        res.status(404).json({ message: 'User does not exist' });
        return; // Add return statement to exit the function
      }

      // send the request if not already requested
      userFound.pendingFriends.incoming.push({
        userId: currentUser._id,
        name: currentUser.username
      });

      currentUser.pendingFriends.outgoing.push({
        userId: userFound._id,
        name: userFound.username
      });

      // save the new pending friends objects to the database
      Promise.all([userFound.save(), currentUser.save()])
        .then(() => {
          res.status(200).json({
            message: 'You have successfully sent a friend request'
          });
        })
        .catch(err => {
          res.status(500).json({
            message: 'Unexpected error sending friend request'
          });
        });
    })
    .catch(err => {
      // Handle other errors related to database or findById
      res.status(500).json({
        message: 'Unexpected error finding user'
      });
    });

  })

  .catch(err => {
    console.log(err);
    res.sendStatus(404)
  });

}

const accept = (req, res, next) => {
  
  const { acceptUser } = req.body;

  User.findById(req.userInfo.id) // req.userInfo.id is the id of the user making the request (.userInfo is created in a middleware function)
  .then(currentUser => {

    // check if currentUser is found, then make sure not already friends and that a request has been sent already

    if (!currentUser) {
      res.status(404).json({ message: 'Invalid user ID' });
      return;
    }

    // if already friends
    if (currentUser.friends.some(friend => friend.userId === acceptUser)) {
      res.status(409).json({ message: 'This user is already your friend' });
      return;
    }

    // if the user hasn't sent a friend request
    if (!(currentUser.pendingFriends.incoming.some(incomingFriend => incomingFriend.userId === acceptUser))) {
      res.status(404).json({ message: 'This user has not sent you a friend request' });
      return;
    }

    // find the user to accept
    User.findById(acceptUser)
    .then(userFound => {

      if (!userFound) {
        res.status(404).json({ message: 'User does not exist' });
        return;
      }

      // add to the friends list of the user
      userFound.friends.push({
        userId: currentUser._id,
        name: currentUser.username
      })

      // remove all the the pending requests as they are now accepted
      userFound.pendingFriends.outgoing = userFound.pendingFriends.outgoing.filter(pending => pending.userId !== currentUser._id.toHexString());

      currentUser.friends.push({
        userId: userFound._id,
        name: userFound.username
      });

      currentUser.pendingFriends.incoming = currentUser.pendingFriends.incoming.filter(pending => pending.userId !== userFound._id.toHexString());

      // save changes to database
      Promise.all([userFound.save(), currentUser.save()])
      .then(() => {
        res.status(200).json({
          message: 'success you have successfully accepted this users friend request'
        });
        return;
      })
      .catch(err => {
        res.json({
          message: 'unexpected error accepting friend request'
        });
      });

    })

    .catch(err => {
      res.json({
        message: 'unexpected error accepting friend request'
      });
    });
  })

  .catch(err => {
    console.log(err);
    res.sendStatus(404)
  });
  
}

const unfriend = (req, res, next) => {
  
  const {unfriendUser} = req.body;
  console.log(unfriendUser)
  User.findById(req.userInfo.id) // req.userInfo.id is the id of the user making the request (.userInfo is created in a middleware function)
  .then(currentUser => {

    // check if currentUser is found
    if (!currentUser) {
      res.status(404).json({ message: 'Invalid user ID' });
      return;
    }

    // if not already friends
    if (!(currentUser.friends.some(friend => friend.userId === unfriendUser))) {
      res.status(409).json({ message: 'This user is not your friend' });
      return;
    }

    // find the user to accept
    User.findById(unfriendUser)
    .then(userFound => {

      if (!userFound) {
        res.status(404).json({ message: 'User does not exist' });
        return;
      }

      // remove the user from the friends list (filter them out)
      userFound.friends = userFound.friends.filter(friend => friend.userId !== currentUser._id.toHexString());
      // remove the friend from the other person as well
      currentUser.friends = currentUser.friends.filter(friend => friend.userId !== userFound._id.toHexString()); // userFound.username === unfriendUser Variable

      // save changes to database
      Promise.all([userFound.save(), currentUser.save()])
      .then(() => {
        res.status(200).json({
          message: 'success you have successfully unfriended the user'
        });
      })
      .catch(err => {
        res.json({
          message: 'unexpected error unfriending the user'
        });
      });
    })

    .catch(err => {
      console.log(err);
      res.sendStatus(404)
    });

  });
}

const unrequest = (req, res, next) => {
  
  const {unrequestUser} = req.body;

  User.findById(req.userInfo.id) // req.userInfo.id is the id of the user making the request (.userInfo is created in a middleware function)
  .then(currentUser => {

    // check if currentUser is found
    if (!currentUser) {
      res.status(404).json({ message: 'Invalid user ID' });
      return;
    }

    if (currentUser.friends.some(friend => friend.userId === unrequestUser)) {
      res.status(409).json({ message: 'You are already friends with this user. If you wish to unfriend them please use /unfriend instead.' });
      return;
    }

    // if not requested in the first place
    if (!(currentUser.pendingFriends.outgoing.some(pending => pending.userId === unrequestUser))) {
      res.status(409).json({ message: 'You do not have an outgoing friend request to this user' });
      return;
    }

    // find the user to un friend request
    User.findById(unrequestUser)
    .then(userFound => {

      if (!userFound) {
        res.status(404).json({ message: 'User does not exist' });
        return;
      }

      console.log('Before Filter - incoming:', userFound.pendingFriends.incoming);
      console.log('Before Filter - outgoing:', currentUser.pendingFriends.outgoing);

      console.log(userFound.pendingFriends.incoming.length)
      
      userFound.pendingFriends.incoming = userFound.pendingFriends.incoming.filter(pending => pending.userId !== currentUser._id.toHexString());
      currentUser.pendingFriends.outgoing = currentUser.pendingFriends.outgoing.filter(pending => pending.userId !== userFound._id.toHexString());
      
      console.log('After Filter - incoming:', userFound.pendingFriends.incoming);
      console.log('After Filter - outgoing:', currentUser.pendingFriends.outgoing);
      
      console.log(userFound.pendingFriends.incoming.length)

      // save changes to database
      Promise.all([userFound.save(), currentUser.save()])
      .then(() => {
        res.json({
          message: 'success you have successfully unsent your friend request to this user'
        });
      })
      .catch(err => {
        res.json({
          message: 'unexpected error while trying to cancel friend request'
        });
      });
    })

    .catch(err => {
      console.log(err);
      res.sendStatus(404)
    });

  });
}

const friends = (req, res, next) => {
  User.findById(req.userInfo.id)
  .then(user => {
    if (!user) {
      res.status(404).json({ message: 'Invalid user ID' });
      return;
    }
    res.json(user.friends)
  })
}

const incoming = (req, res, next) => {
  User.findById(req.userInfo.id)
  .then(user => {
    if (!user) {
      res.status(404).json({ message: 'Invalid user ID' });
      return;
    }
    res.json(user.pendingFriends.incoming)
  })
}

const outgoing = (req, res, next) => {
  User.findById(req.userInfo.id)
  .then(user => {
    if (!user) {
      res.status(404).json({ message: 'Invalid user ID' });
      return;
    }
    res.json(user.pendingFriends.outgoing)
  })
}

const friendStatus = (req, res, next) => {
  const userIdToSearchFor = req.query.checkFriend;
  console.log(userIdToSearchFor)
  User.findById(req.userInfo.id)
  .then(user => {
    if (!user) {
      res.status(404).json({ message: 'Invalid user ID' });
      return;
    }
    const isUserInFriends = user.friends.some(friend => friend.userId === userIdToSearchFor);
    const isUserInRequested = user.pendingFriends.outgoing.some(friend => friend.userId === userIdToSearchFor);
    
    res.json({
      friends: isUserInFriends,
      requested: isUserInRequested
    })
  })
}

module.exports = {
  // creating decks and flashcards and editing and deleting cards
  request,
  accept,

  unfriend,
  unrequest,

  friends,
  incoming,
  outgoing,
  friendStatus

  // request TYPE = PUT
  // accept TYPE = PUT

  // unfriend TYPE = DELETE
  // unrequest TYPE = DELETE

  // friends TYPE = GET
  // incoming TYPE = GET
  // outgoing TYPE = GET
}