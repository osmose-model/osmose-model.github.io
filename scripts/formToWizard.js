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

        $(element).before("<ul id='steps'></ul>");

        steps.each(function(i) {
            $(this).wrap("<div id='step" + i + "'></div>");
            $(this).append("<p id='step" + i + "commands'></p>");

            var name = $(this).find("legend").html();
		
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
		
	    $(this).prepend("<p id='step" + i + "commands'></p>");	
            var name = $(this).find("legend").html();
		
            if (i == 0) {
				
            }
            else if (i == count - 1) {

            }
	    else if (i == count - 2) {

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
                $("#step" + (i - 1)).show();
                $(submmitButtonName).hide();
            });
        }

        function createNextButton(i) {
            var stepName = "step" + i;
            $("#" + stepName + "commands").append("<a href='#' id='" + stepName + "Next' class='next'>Proceed</a>");

            $("#" + stepName + "Next").bind("click", function(e) {
				var valid = true;
				if(i == 0){
					valid = validateform1();
				}else if(i == 1){
					valid = validateformGroup();
				}else if(i == 4){
					valid = validateStep();
				}
				
				if(valid){
					$("#" + stepName).hide();
					$("#step" + (i + 1)).show();
					if (i + 2 == count)
						$(submmitButtonName).show();
				}
            });
        }
    }
})(jQuery); 
