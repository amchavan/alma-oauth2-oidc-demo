<#include "*/common/header.ftl">

<div class="container-fluid">
    <div>
        This is a secured page, welcome <span style="color:cadetblue;">${username!""}</span>
    </div>
    <div>&nbsp;</div>
    <div>
        <a class="btn btn-primary" href="/">Home</a>
        <p></p>
        <a class="btn btn-primary" href="/logout">Logout</a>
    </div>
</div>

<#include "*/common/footer.ftl">

