def controlar_nombre(nombre):
    if nombre=="":
        raise Exception({nombre:'El nombre no debe ser vacío'})