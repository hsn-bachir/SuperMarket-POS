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

from io import BytesIO

from django.http import HttpResponse

from reportlab.lib import colors
from reportlab.lib.pagesizes import A4, landscape
from reportlab.lib.styles import getSampleStyleSheet
from reportlab.platypus import (
    SimpleDocTemplate,
    LongTable,
    TableStyle,
    Paragraph,
)


def export_pdf(filename, rows):
    response = HttpResponse(
        content_type="application/pdf"
    )

    response["Content-Disposition"] = (
        f'attachment; filename="{filename}.pdf"'
    )

    buffer = BytesIO()

    document = SimpleDocTemplate(
        buffer,
        pagesize=landscape(A4),
        leftMargin=20,
        rightMargin=20,
        topMargin=20,
        bottomMargin=20,
    )

    elements = []

    if not rows:
        document.build(elements)

        pdf = buffer.getvalue()
        buffer.close()

        response.write(pdf)
        return response

    styles = getSampleStyleSheet()

    header_style = styles["Heading5"]
    body_style = styles["BodyText"]

    header_style.fontSize = 9
    body_style.fontSize = 9
    body_style.leading = 11

    table_data = []

    table_data.append([
        Paragraph(str(col), header_style)
        for col in rows[0].keys()
    ])

    for row in rows:
        table_data.append([
            Paragraph(
                str(value) if value is not None else "",
                body_style,
            )
            for value in row.values()
        ])

    page_width = (
        landscape(A4)[0]
        - document.leftMargin
        - document.rightMargin
    )

    num_cols = len(table_data[0])

    col_width = page_width / num_cols

    table = LongTable(
        table_data,
        colWidths=[col_width] * num_cols,
        repeatRows=1,
    )

    table.setStyle(
        TableStyle(
            [
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
                    "FONTNAME",
                    (0, 0),
                    (-1, 0),
                    "Helvetica-Bold",
                ),
                (
                    "FONTSIZE",
                    (0, 0),
                    (-1, -1),
                    9,
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
                    "VALIGN",
                    (0, 0),
                    (-1, -1),
                    "TOP",
                ),
                (
                    "WORDWRAP",
                    (0, 0),
                    (-1, -1),
                    "CJK",
                ),
                (
                    "LEFTPADDING",
                    (0, 0),
                    (-1, -1),
                    4,
                ),
                (
                    "RIGHTPADDING",
                    (0, 0),
                    (-1, -1),
                    4,
                ),
                (
                    "TOPPADDING",
                    (0, 0),
                    (-1, -1),
                    5,
                ),
                (
                    "BOTTOMPADDING",
                    (0, 0),
                    (-1, -1),
                    5,
                ),
            ]
        )
    )

    elements.append(table)

    document.build(elements)

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