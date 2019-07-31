function main() 
{
    console.log("main function");
    console.log("ajax request to the resource which will require cors enabled");
    $.ajax
    ({
        dataType: "html",
        url: "http://domain4.com/content/we-retail/us/en/women.html",
        success: function(data) 
        {
            console.log("--------- log response on SUCCESS - domain1.com ---------");
            console.log(data);
        },
        error: function(data) 
        {
            console.log("--------- log response on ERROR - domain1.com ---------");
            //console.log(data);
        }
    });
	
}