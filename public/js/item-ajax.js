var page = 1;
var current_page = 1;
var total_page = 0;
var is_ajax_fire = 0;

manageData();

/* manage data list */
function manageData() {
    $.ajax({
        dataType: 'json',
        url: url,
        data: {page:page}
    }).done(function(data){

        total_page = data.last_page;
        current_page = data.current_page;

        $('#pagination').twbsPagination({
            totalPages: total_page,
            visiblePages: current_page,
            onPageClick: function (event, pageL) {
                page = pageL;
                if(is_ajax_fire != 0){
                  getPageData();
                }
            }
        });

        manageRow(data.data);
        is_ajax_fire = 1;
    });
}

$.ajaxSetup({
    headers: {
            'X-CSRF-TOKEN': $('meta[name="csrf-token"]').attr('content')
        }
});

/* Get Page Data*/
function getPageData() {
    $.ajax({
        dataType: 'json',
        url: url,
        data: {page:page}
    }).done(function(data){
        manageRow(data.data);
    });
}

/* Add new Item table row */
function manageRow(data) {
    var rows = '';
    $.each( data, function( key, value ) {
        rows = rows + '<tr>';
        rows = rows + '<td>'+value.id+'</td>';
        rows = rows + '<td>'+value.label+'</td>';
        rows = rows + '<td>'+value.date+'</td>';
         rows = rows + '<td>'+value.distribution+'</td>';
        rows = rows + '<td data-id="'+value.id+'">';
        rows = rows + '<button data-toggle="modal" data-target="#edit-item" class="btn btn-primary edit-item">Edit</button> ';
        rows = rows + '<button class="btn btn-danger remove-item">Delete</button>';
        rows = rows + '</td>';
        rows = rows + '</tr>';
    });

    $("tbody").html(rows);
}

/* Create new Item */
$(".crud-submit").click(function(e){
    e.preventDefault();
    var form_action = $("#create-item").find("form").attr("action");
    var label = $("#create-item").find("input[name='label']").val();
    var distribution = $("#create-item").find("input[name='distribution']").val();
    var date = $("#create-item").find("input[name='date']").val();
    

    $.ajax({
        dataType: 'json',
        type:'POST',
        url: url,
        data:{label:label, distribution:distribution, date:date}
    }).done(function(data){
        getPageData();
        $(".modal").modal('hide');
        toastr.success('Item Created Successfully.', 'Success Alert', {timeOut: 5000});
    });
    
});

/* Remove Item */
$("body").on("click",".remove-item",function(){
    var id = $(this).parent("td").data('id');
    var c_obj = $(this).parents("tr");
    $.ajax({
        dataType: 'json',
        type:'delete',
        url: url + id,
    }).done(function(data){
        c_obj.remove();
        toastr.success('Item Deleted Successfully.', 'Success Alert', {timeOut: 5000});
        getPageData();
    });
});

/* edit Item */
$("body").on("click",".edit-item",function(){
    var id = $(this).parent("td").data('id');
    var label = $(this).parent("td").prev("td").prev("td").prev("td").text();
    var distribution = $(this).parent("td").prev("td").text();
    var date = $(this).parent("td").prev("td").prev("td").text();
    $("#edit-item").find("input[name='label']").val(label);
    $("#edit-item").find("input[name='distribution']").val(distribution);
    $("#edit-item").find("input[name='date']").val(date);
    $("#edit-item").find("input[name='ID']").val(id);
    $("#edit-item").find("form").attr("action",url + id);
});

/* update Item */
$(".crud-submit-edit").click(function(e){
    e.preventDefault();
    var id = $("#edit-item").find("input[name='ID']").val();
    var form_action = $("#edit-item").find("form").attr("action");
    var label = $("#edit-item").find("input[name='label']").val();
    var distribution = $("#edit-item").find("input[name='distribution']").val();
    var date = $("#edit-item").find("input[name='date']").val();
   

    $.ajax({
        dataType: 'json',
        type:'PUT',
        url: url + id,
        data:{label:label, distribution:distribution, date:date}
    }).done(function(data){
        getPageData();
        $(".modal").modal('hide');
        toastr.success('Item Updated Successfully.', 'Success Alert', {timeOut: 5000});
    });
});