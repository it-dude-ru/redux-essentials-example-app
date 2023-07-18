import React from 'react'
import {
  BrowserRouter as Router,
  Switch,
  Route,
  Redirect,
} from 'react-router-dom'

import { Navbar } from './app/Navbar';

import { PostsList } from './features/posts/PostsList';
<<<<<<< HEAD
import { SinglePostPage } from './features/posts/SinglePostPage';
=======
import { AddPostForm } from './features/posts/AddPostForm';
>>>>>>> 4eb60c5dfec524f73315b754f0be53715a830ad1

function App() {
  return (
    <Router>
      <Navbar />
      <div className="App">
        <Switch>
          <Route
            exact
            path="/"
            render={() => (
              <>
			  	<AddPostForm />
			  	<PostsList />
			  </>
            )}
          />
		  <Route exact path="posts/:postId" component={SinglePostPage} />
          <Redirect to="/" />
        </Switch>
      </div>
    </Router>
  )
}

export default App
