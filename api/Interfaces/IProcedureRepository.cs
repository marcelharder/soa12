
using System.Collections.Generic;
using System.Threading.Tasks;
using api.DTOs;
using api.Entities;
using api.Helpers;

namespace api.Interfaces
{
    public interface IProcedureRepository
    {
      
        Task<PagedList<Class_Procedure>> GetProcedures(ProcedureParams procParams);
        Task<PagedList<Class_Procedure>> GetAioProcedures(ProcedureParams procParams);
        Task<PagedList<Class_Procedure>> GetAssistedProcedures(ProcedureParams procParams);
        Task<Class_Procedure> GetProcedure(int id);
        Task<int> addProcedure(Class_Procedure p);
        Task<int> updateProcedure(Class_Procedure p);
        Task<bool> SaveAll();
        Task<int> DeleteAsync<T>(T entity) where T : class;
        Task<int> checkAndDeleteCollateralTables(int id);
        Task<List<int>> getProceduresFromPatientId(string mrn);
        Task<ButtonPerProcedureSoortDTO> getButtonsAndActions(int soort);
        Task<string> getProdedureDescription(int soort);
        Task<string> refPhysEmailHash(int id);
        Task<int> getProcedureIdFromHash(string hash);
        Task<bool> IsThisReportLessThan3DaysOld(int id);
        Task<bool> pdfDoesNotExists(string id_string);
       
    }
}
