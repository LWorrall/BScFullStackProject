$(window).on("load", function() {    
    $(function () {
        let socket = io("http://localhost:9000");

        // Function for the 'log out' button. 
        $("#logoutButton").on("click", function () {
            // Clear cookies and redirect the user to the logged out page.
            let user = [
                localStorage.loggedInUser,
                localStorage.pixelsDrawnThisSession
            ];
            localStorage.clear();
            socket.emit("logged out", user);
            window.location.replace("loggedout.html");
        });
    });

    $("#account").on("click", function () {
        if (localStorage.getItem('loggedInFlag') != 'true')
        window.location.replace("login.html")
        else
            window.location.replace("account.html");
    });

    // Hide the log out button if the user is not logged in.
    if (localStorage.getItem('loggedInFlag') != 'true')
    $("#logoutButton").css("display","none");
    else
        $("#usernametag").text(localStorage.loggedInUser);
});