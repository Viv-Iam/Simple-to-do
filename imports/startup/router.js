Flowrouter.route('/', {
    action:function(){
        BlazeLayout.render('App_Body',
        {main:Landing_page}
    );
    }
})