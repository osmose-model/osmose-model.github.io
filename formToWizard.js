(function($) {
    $.fn.formToWizard = function(options) {
        options = $.extend({  
            submitButton: "" 
        }, options); 
        
        var element = this;

        var steps = $(element).find("fieldset");
        var count = steps.size();
        var submmitButtonName = "#" + options.submitButton;
        $(submmitButtonName).hide();

        // 2
        $(element).before("<ul id='steps'></ul>");

        steps.each(function(i) {
            $(this).wrap("<div id='step" + i + "'></div>");
            $(this).append("<p id='step" + i + "commands'></p>");

            // 2
            var name = $(this).find("legend").html();
            /*$("#steps").append("<li id='stepDesc" + i + "'>Step " + (i + 1) + "<span>" //+ name 
			+ "</span></li>");*/
		
            if (i == 0) {
				createNextButton(i);
            }
            else if (i == count - 1) {
                $("#step" + i).hide();
                createPrevButton(i);
            }
            else {
                $("#step" + i).hide();
                createPrevButton(i);
                createNextButton(i);
            }
        });

        function createPrevButton(i) {
            var stepName = "step" + i;
            $("#" + stepName + "commands").append("<a href='#' id='" + stepName + "Prev' class='prev'>Back</a>");

            $("#" + stepName + "Prev").bind("click", function(e) {
                $("#" + stepName).hide();
				if(i == 3) $("#step" + (i - 1 - 1)).show();
                else $("#step" + (i - 1)).show();
                $(submmitButtonName).hide();
            });
        }

        function createNextButton(i) {
            var stepName = "step" + i;
            $("#" + stepName + "commands").append("<a href='#' id='" + stepName + "Next' class='next'>Proceed</a>");

            $("#" + stepName + "Next").bind("click", function(e) {
				var valid = validateform1();
				
				if(valid){
					$("#" + stepName).hide();
					if(i == 2) $("#step" + (i + 1 + 1)).show();
					else $("#step" + (i + 1)).show();
					if (i + 2 == count)
						$(submmitButtonName).show();
				}
            });
        }
    }
})(jQuery); 