<?php
    include "head.html";
    include "nav.html";
    include "./templates/overlay.html";
?>


<main class = "p-10">
    <?php
        include "./forms/createEvent.html";
    ?>

    <div class = "flex flex-col items-center mt-4 gap-2">
        <button id = "cancel-event" class = "border p-2 rounded text-red-500 bg-red-500 text-white">Cancel Event</button>
        <h1 class = "text-4xl font-black text-center">Event Registrants</h1>
        <div id = "participants" class = "w-full border flex flex-col justify-center items-center">

        </div>
    </div>

</main>





<script type = "module" src = "index.js"></script>