<?php
    include "head.html";
    include "./templates/overlay.html";
?>

<body>
    <main class = "w-full h-screen relative flex justify-center items-center">
        <div class = "flex flex-row items-center justify-center gap-6">
            <div class = "w-[40%]">
                <h1 class = "font-bold text-4xl">Metro Events</h1>
                <p>A dynamic event platform that connects users with a diverse range of local events, providing a seamless experience for event discovery, registration, and participation.</p>
            </div>
            <?php
                include "forms/login.html";
            ?>
        </div>

        <?php
          include "footer.html"
        ?>
    </main>


    <?php
        include "forms/register.html"
    ?> 


    <script type = "module" src = "index.js"></script>
</body>

</html>
