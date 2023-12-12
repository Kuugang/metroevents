<?php
    include "../head.html";
    include "nav.html";
    include "../templates/spinner.html";
    include "../templates/overlay.html";
?>


<div class = "flex flex-col items-center p-4 gap-2">
    <h1 class = "font-bold mb-2 text-2xl">Organizers</h1>  
    <div id = "organizers" class = "w-1/2">

    </div>

    <h1 class = "font-bold mb-2 text-2xl">Event Types</h1>  
    <div>
        <form id = "new-event-type-form" class = "mt-4 p-4 border">
            <input id = "new-event-type" name = "new-event-type" type="text" class = "border rounded p-2" placeholder = "Add new event type">
            <button type = "submit" class = "text-white hover:text-green-500 border border-green-500 p-2 rounded bg-green-500 hover:bg-white">
                <i class="fa-solid fa-plus fa-lg"></i>
            </button>
        </form>
        <div id = "event-types">

        </div>
    </div>
</div>


<script type = "module" src=  "./admin.js"></script>