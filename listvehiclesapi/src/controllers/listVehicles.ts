import { Request, Response } from "express";
import { getManager } from "typeorm";
import { Rental } from "../entity/Rental";
import { Vehicle } from "../entity/Vehicle";
import { VehicleState } from "../entity/VehicleState";
import { Borne } from "../entity/Borne";
import { Tenant } from "../entity/Tenant";
import { User } from "../entity/User";

export const get = (_req: Request, res: Response) => {
    res.end("Vehicles Service");
}


//Get list of Allocated vehicles
/*export async function getAllocatedVehicles(_req: Request, res: Response) {
    try {
        const listVehicles = await getManager()
            .createQueryBuilder()
            .select("vehicle.idVehicle")
            .addSelect("vehicle.vehicleType")
            .addSelect("vehicle.vehicleBrand")
            .addSelect("vehicle.vehicleModel")
            .addSelect("user.firstName")
            .addSelect("user.lastName")
            .addSelect("state.availability")
            .from(Vehicle, "vehicle")
            .innerJoin(Rental, "rental", "vehicle.idVehicle=rental.idVehicle")
            .innerJoin(Tenant, "tenant", "rental.idTenant=tenant.idTenant")
            .innerJoin(User, "user", "tenant.idUser=user.idUser")
            .innerJoin(VehicleState, "state", "state.idRental=rental.idRental AND state.availability=:statusAlo", {
                statusAlo: "Allocated"
            })
            .getRawMany()
        return res.json(listVehicles)
    }
    catch (error) {
        //res.status(error.response.status)
        return res.send(error);
    }
}
*/

//add a new vehicle
/*export const addVehicle = async (req: Request, res: Response) => {
    const vehicle = Vehicle.create({
        vehicleType: req.body.vehicleType,
        vehicleBrand: req.body.vehicleBrand,
        vehicleModel: req.body.vehicleModel,
        idBorne: req.body.idBorne
    })
    await vehicle.save()
    res.send(vehicle)
}*/

//get All vehicles
export async function getV(req: Request, res: Response) {
    const page=Number(req.query.page || "0")
    //const page=0
    //const limit=2
    const limit=Number(req.query.limit || "8")
    const vehicles = await getManager()
    .createQueryBuilder()
    .select("vehicle.unitpriceperday")
    .addSelect("vehicle.unitpriceperhour")
    .from(Vehicle,"vehicle")
    .take(limit)
    .skip(limit*page)
    .getMany();
    res.json(vehicles)
}

//Delete a vehicle
export async function deleteVehicle(req: Request, res: Response) {
    const id = req.params.id; 
    try {
        const panne = await Vehicle.findOneOrFail(id);
        await panne.remove(); 
        return res.json({ message: 'Vehicle deleted' })
    } catch (err){
        console.log(err); 
        return res.status(500).json(err);
    } 
}



//get All vehicles
export async function getVehicles(_req: Request, res: Response) {
    const vehicles = await Vehicle.find();
    for (const v of vehicles){
        try {
            const rental = await Rental.findOne({idVehicle:v.idVehicle});
            if (rental){   
                const vehicles = await getManager()
                .createQueryBuilder()
                .select("vehicle.vehicleType")
                .addSelect("vehicle.vehicleBrand")
                .addSelect("vehicle.vehicleModel")
                .addSelect("user.firstName")
                .addSelect("user.lastName")
                .addSelect("vehicle.availibility")
                .from(Vehicle, "vehicle")
                .innerJoin(Rental, "rental", "vehicle.idVehicle=rental.idVehicle")
                .innerJoin(Tenant, "tenant", "rental.idTenant=tenant.idTenant")
                .innerJoin(User, "user", "tenant.idUser=user.idUser")
                .getRawMany()
            }else {
                const vehicles = await Vehicle.find();
            }
        }
        catch (err){
            console.log(err); 
            return res.status(500).json(err);
        } 
    }
    return res.json(vehicles)
}


