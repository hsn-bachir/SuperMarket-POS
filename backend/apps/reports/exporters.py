import csv
from io import BytesIO
from django.http import HttpResponse
from openpyxl import Workbook
from reportlab.lib import colors

from reportlab.platypus import (
    SimpleDocTemplate,
    Table,
    TableStyle,
)

def export_csv(filename, rows):
    response = HttpResponse(
        content_type="text/csv"
    )
    response[
        "Content-Disposition"
    ] = (
        f'attachment; filename="{filename}.csv"'
    )
    writer = csv.writer(response)
    if not rows:
        return response
    writer.writerow(rows[0].keys())
    for row in rows:
        writer.writerow(
            row.values()
        )
    return response


def export_excel(filename, rows):
    wb = Workbook()
    ws = wb.active
    ws.title = filename
    if rows:
        ws.append(
            list(rows[0].keys())
        )
        for row in rows:
            ws.append(
                list(row.values())
            )
    response = HttpResponse(
        content_type=(
            "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
        )
    )
    response[
        "Content-Disposition"
    ] = (
        f'attachment; filename="{filename}.xlsx"'
    )
    wb.save(response)
    return response

def export_pdf(filename, rows):
    response = HttpResponse(
        content_type="application/pdf"
    )
    response[
        "Content-Disposition"
    ] = (
        f'attachment; filename="{filename}.pdf"'
    )
    buffer = BytesIO()
    document = SimpleDocTemplate(
        buffer
    )
    table_data = []
    if rows:
        table_data.append(
            list(rows[0].keys())
        )
        for row in rows:

            table_data.append(
                list(row.values())
            )
    table = Table(table_data)
    table.setStyle(
        TableStyle([

            (
                "BACKGROUND",
                (0, 0),
                (-1, 0),
                colors.grey,
            ),

            (
                "TEXTCOLOR",
                (0, 0),
                (-1, 0),
                colors.white,
            ),

            (
                "GRID",
                (0, 0),
                (-1, -1),
                1,
                colors.black,
            ),

            (
                "BACKGROUND",
                (0, 1),
                (-1, -1),
                colors.beige,
            ),

            (
                "BOTTOMPADDING",
                (0, 0),
                (-1, 0),
                8,
            ),

        ])
    )
    document.build([table])
    pdf = buffer.getvalue()
    buffer.close()
    response.write(pdf)
    return response

def export_response(
    request,
    filename,
    rows,
):
    export = request.GET.get(
        "export"
    )
    if export == "csv":
        return export_csv(
            filename,
            rows,
        )
    if export == "excel":
        return export_excel(
            filename,
            rows,
        )
    if export == "pdf":
        return export_pdf(
            filename,
            rows,
        )
    return None