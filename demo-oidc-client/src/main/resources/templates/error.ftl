<#include "*/common/header.ftl">
<h2>Error <em>${status} ${error}</em></h2>
<table>
    <tr>
        <td>Date</td>
        <td>${timestamp?datetime}</td>
    </tr>
    <tr>
        <td>Message</td>
        <td>${message}</td>
    </tr>
    <tr>
        <td>Exception</td>
        <td>${exception!"(no exception thrown)"}</td>
    </tr>
</table>
<p></p>
<div>
    <a class="ui button" href="/">Home</a>
</div>
<#include "*/common/footer.ftl">
