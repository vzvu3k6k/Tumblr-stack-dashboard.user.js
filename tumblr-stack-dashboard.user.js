// ==UserScript==
// @name           Tumblr: Stack Dashboard
// @description    Keep digging dsbd with video/audio posts playing in stack
// @version        0.1
// @author         vzvu3k6k
// @include        http://www.tumblr.com/dashboard
// @include        http://www.tumblr.com/dashboard/*
// @include        http://www.tumblr.com/reblog/*
// @include        http://www.tumblr.com/likes
// @include        http://www.tumblr.com/likes/*
// @include        http://www.tumblr.com/blog/*
// @include        http://www.tumblr.com/tagged/*
// @include        http://www.tumblr.com/show/*
// @include        http://www.tumblr.com/liked/by/*
// @namespace      http://vzvu3k6k.tk/
// @license        public domain
// ==/UserScript==

(function(){
    GM_addStyle(".side-dashboard-mode #container {width: auto;}");
    GM_addStyle("body:not(.side-dashboard-mode) #side-dashboard .posts, #side-dashboard.empty {display: none;}");
    GM_addStyle("#side-dashboard {position: fixed; top: 0; right: 0; padding: 5%; width: 500px; padding: 0.5em 0.5em 0 0; pointer-events: none; height: 100%;}");
    GM_addStyle("#side-dashboard {pointer-events: none;}");
    GM_addStyle("#side-dashboard {overflow-y: scroll;}");
    GM_addStyle("#side-dashboard .post {pointer-events: auto; padding: 5px; background: #fff; border-radius: 6px;}");
    GM_addStyle("#side-dashboard .post .post_controls, #side-dashboard .post .post_info {display: inline;}");
    GM_addStyle("#side-dashboard .post .avatar_and_i, #side-dashboard .post .arrow, #side-dashboard .post .notes_outer_container{display: none;}");
    GM_addStyle("#side-dashboard .post .permalink {background: none;}");
    GM_addStyle("#side-dashboard-control {pointer-events: auto; text-decoration: none; color: black; background-color: white; border-radius: 2px; margin-bottom: 5px; text-align: center; width: 100%; display: block;}");
    GM_addStyle("#return_to_top {display: none;}");

    document.body.insertAdjacentHTML("beforeend",
      '<div id="side-dashboard" class="empty">' +
        '<a id="side-dashboard-control" href="#">▼</a>' +
        '<div class="posts"/>' +
      '</div>');

    var sideDashboard = document.querySelector("#side-dashboard");
    var postsContainer = sideDashboard.querySelector(".posts");
    var isSideDashboardOpen = false;

    document.addEventListener("keydown", function(event){
        if(event.keyCode == 83){
            if(event.shiftKey){
                postsContainer.querySelector(".post .delete_button").click();
            }else{
                var post = getCurrentPost();
                if(!post) return;
                moveToSide(post);
                openSideDashboard();
            }
        }
    });

    sideDashboard.querySelector("#side-dashboard-control").addEventListener("click", function(event){
        event.preventDefault();
        toggleSideDashboard();
    });

    function toggleSideDashboard(){
        isSideDashboardOpen ? closeSideDashboard() : openSideDashboard();
    }

    function openSideDashboard(){
        if(isSideDashboardOpen) return;
        isSideDashboardOpen = true;
        document.body.classList.add("side-dashboard-mode");
        sideDashboard.querySelector("#side-dashboard-control").textContent = "▲";
    }

    function closeSideDashboard(){
        if(!isSideDashboardOpen) return;
        isSideDashboardOpen = false;
        document.body.classList.remove("side-dashboard-mode");
        sideDashboard.querySelector("#side-dashboard-control").textContent = "▼";
    }

    function moveToSide(postElement){
        openSideDashboard();
        sideDashboard.classList.remove("empty");
        postsContainer.insertBefore(postElement, postsContainer.firstChild);

        /* append close button */
        var controlContainer = postElement.querySelector(".post_controls");
        controlContainer.insertAdjacentHTML("afterbegin", '<a href="#" class="post_control post_control_icon delete_button">close</a>');
        controlContainer.querySelector(".delete_button").addEventListener("click", function(event){
            event.preventDefault();
            returnToMain(postElement);
        });
    }

    function returnToMain(postElement){
        var currentPost = getCurrentPost(true);
        currentPost.parentNode.insertBefore(postElement, currentPost.nextElementSibling || currentPost);

        if(postsContainer.children.length == 0){
            sideDashboard.classList.add("empty");
            closeSideDashboard();
        }
    }

    function getCurrentPost(force){
        var margin_top = 7;
        var posts = document.querySelectorAll('#posts>.post:not(.new_post)');
        if(force){
            for(var i = 0; i < posts.length; i++)
                if(window.scrollY - (posts[i].offsetTop - margin_top) < 0){
                    if(window.scrollY + document.documentElement.clientHeight < posts[i].offsetTop - margin_top){
                        /* 見つけた要素が表示部分より下にある（長いポストの真ん中を見ている状態）なら、その一つ前の要素を返す */
                        // console.log("1", posts[i], posts[i].previousElementSibling);
                        return posts[i].previousElementSibling;
                    }else{
                        // console.log("2", posts[i], posts[i].previousElementSibling);
                        return posts[i];
                    }
                }
        }else{
            for(var i = 0; i < posts.length; i++)
                if(Math.abs(window.scrollY - (posts[i].offsetTop - margin_top)) < 5)
                    return posts[i];
            return null;
        }
    }
})()