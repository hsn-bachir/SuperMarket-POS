from importlib.util import module_from_spec, spec_from_file_location
from pathlib import Path


_test_path = Path(__file__).parent / "tests" / "test_accounting_fixes.py"
_test_spec = spec_from_file_location(
	"apps.accounting.regression_tests",
	_test_path,
)
_test_module = module_from_spec(_test_spec)
_test_spec.loader.exec_module(_test_module)

for _name, _value in vars(_test_module).items():
	if _name.endswith("Tests"):
		_value.__module__ = __name__
		globals()[_name] = _value