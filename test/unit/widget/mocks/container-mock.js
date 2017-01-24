( function( window ) {

  var container = window.document.createElement( "div" ),
    sheet = window.document.createElement( "rise-google-sheet" ),
    body = document.getElementsByTagName( "BODY" )[ 0 ];

  container.setAttribute( "id", "mainContainer" );

  sheet.id = "rise-google-sheet";
  sheet.go = function() {};

  body.appendChild( container );
  body.appendChild( sheet );

} )( window );
