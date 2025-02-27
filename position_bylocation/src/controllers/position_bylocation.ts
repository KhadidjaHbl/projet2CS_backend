import { Request, Response } from "express";
import { getManager } from "typeorm";
import { stat } from "node:fs";
import { VehiclePosition } from "../entity/VehiclePosition";
import { VehicleTracking } from "../entity/VehicleTracking";

export const get = (_req: Request, res: Response) => {
    res.end("This service is up and running !");
}


export const add_position_ByLocation = async (req: Request, res: Response) => {

    const {idRental,latitude,longitude} = req.body;
    const Vehiclepos = await VehiclePosition.findOne({idRental:idRental})

    if(!Vehiclepos){
        const position=VehiclePosition.create({
            idRental:idRental
        })
        await position.save()
        const tracking=VehicleTracking.create({
            idPosition:position.idPosition,
            latitude:latitude,
            longitude:longitude
        })
        await tracking.save()
        res.status(200).send(tracking)

    }
    else{
        const tracking=await VehicleTracking.findOneOrFail({idPosition:Vehiclepos?.idPosition})
        tracking.idPosition=Vehiclepos.idPosition,
        tracking.latitude=latitude
        tracking.longitude=longitude
        await tracking.save()
        res.status(200).send(tracking)
    }
}
    


