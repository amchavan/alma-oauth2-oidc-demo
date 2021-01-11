<#include "*/common/header.ftl">

<h2>Error <em>${status} ${error}</em></h2>

<div class="container-fluid">
    <div>
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
    </div>

    <div>&nbsp</div>

    <div>
        <a class="btn btn-primary" href="/">Home</a>
    </div>
</div>

<#include "*/common/footer.ftl">
