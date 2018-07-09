(function($, undefined) {
    /**
     * Warn users of IE<11 with an overlay over course content
    **/

    /* While it would be better to do feature detection, we are targeting 
    Internet Explorer versions for ISC warnings.  Gets the job done.
    */

    var browserMVer = $.browser.version.split('.')[0];
    var isIE = (navigator.appName == 'Microsoft Internet Explorer' || navigator.userAgent.indexOf('MSIE') != -1);
    if (!isIE) {
        // only IE's before 11 report a navigator.appName of 
        // 'Microsoft Internet Explorer'
        return;
    }

    var isIE10 = (isIE && browserMVer == 10);
    var isIELT10 = (isIE && browserMVer < 10);

    // check for cookie that IE10 user confirmed using site
    // prefer plain JS over $.cookie as Hawthorne will deprecate for js-cookie
    if (isIE10 && document.cookie.split(';').filter(function(item) {
        return item.indexOf('oldBrowserContinue=1') >= 0;
    }).length) {
        console.info('User chooses to continue in old browser.')
        return;
    }    

    // for IE10 allow user to continue by closing overlay
    var warningHTMLIE10 = "\
    <p>This course works best with the newest versions of Chrome, Firefox, Safari, and Edge. \
    It also works with Internet Explorer version 11.</p>\
    <p>It appears you are using an older version of Internet Explorer. While you may \
    <a href='#' class='closer'>continue to the course</a> using this browser, be aware that  \
    certain features/content may display incorrectly or may not work as a result.</p>";

    // older browser versions must be upgraded
    var warningHTMLIELT10 = "\
    <p>The courses work best with newest versions of Chrome, Firefox, Safari or Edge, or with \
    Internet Explorer version 11.</p> \
    <p>It appears you are using the Internet Explorer browser, so be aware that versions 6, 7, 8, or 9 \
    are not supported.</p> \
    <p>If you wish you access the course, please first \
    <a href='https://www.microsoft.com/en-us/windows/microsoft-edge' target='_blank'>upgrade your browser</a> \
    to a more recent version or contact <a href='mailto:onlinetraining@intersystems.com'>onlinetraining@intersystems.com</a>.";

    var warningHTML = isIE10 ? warningHTMLIE10 : warningHTMLIELT10;

    $(document).ready(function() {

        var content = $('#content');
        var origContentHeight = $(content).innerHeight();
        
        // shrink the content div, to make the footer more 
        // accessible
        $(content).css('overflow', 'hidden');
        $(content).css('height', '250px');

        // create the overlay
        var overlay = document.createElement("div");
        $(overlay).addClass('browserWarning'); // styled in css
        $(overlay).css('top', content.offset().top + 'px');
        $(overlay).css('left', content.offset().left + 'px');
        $(overlay).css('width', '100%');
        $(overlay).css('height', content.innerHeight() + 'px');
        $(overlay).html(warningHTML); 
    
        // append the overlay
        $("body").append(overlay);
        
        // listen for close button listener
        var closer = $(".browserWarning .closer");
        if (closer[0] != undefined) {
            closer[0].addEventListener("click", function(e){
              e.preventDefault();

              // set a cookie that user wishes to continue to use
              document.cookie = "oldBrowserContinue=1";

              // remove the overlay
              $(overlay).remove();
              
              //unshrink the content
              $(content).css('height', origContentHeight + 'px');            
            } );
        }

        //resize the overlay if the content area resizes
        window.addEventListener("resize", function() {
            $(overlay).css('height', content.innerHeight() + 'px');
        });

    });

})(jQuery);
